import { ratelimit } from '@/utils/rateLimit'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs' // Import Node.js filesystem module
import path from 'path' // Import Node.js path module

async function fetchImage(url: string): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  // Define the maximum allowed image size in bytes
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 // 10 KB

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    })
    clearTimeout(id) // Clear timeout if fetch completes in time

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      )
    }

    const contentLengthHeader = response.headers.get('Content-Length')

    // Check Content-Length header if available
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10)
      if (isNaN(contentLength)) {
        console.warn(
          `Content-Length header is not a valid number for URL: ${url}`,
        )
        // TODO: handle images when there is no contentLength
        // throw an error or check its size after loading it.
        // Right now we are just proceeding as if the size is good.
      } else if (contentLength > MAX_IMAGE_SIZE_BYTES) {
        console.warn(
          `Fetched image from ${url} is too large (${contentLength} bytes, limit ${MAX_IMAGE_SIZE_BYTES} bytes).`,
        )
        throw new Error('Image too large') // Throw to trigger the default image fallback
      }
    }

    return response
  } catch (error) {
    clearTimeout(id) // Ensure timeout is cleared even on error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Image fetch timed out after 10 seconds for URL: ${url}`)
    }
    throw error
  }
}

export async function GET(request: NextRequest) {
  // --- START RATE LIMITING ---
  let ipIdentifier: string = '127.0.0.1'
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    ipIdentifier = xForwardedFor.split(',')[0].trim()
  }

  const { success, limit, reset, remaining } =
    await ratelimit.limit(ipIdentifier)

  // Add rate limit headers to the response (optional, but good practice)
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', limit.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', reset.toString())

  if (!success) {
    console.warn(`Rate limit exceeded for IP: ${ipIdentifier}`)
    return new NextResponse('Too Many Requests', { status: 429, headers })
  }
  // --- END RATE LIMITING ---

  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  // Define the path to your default image in the public directory
  // This calculates the absolute path to `public/favicon.ico`
  const DEFAULT_IMAGE_FILE_PATH = path.join(
    process.cwd(),
    'src/app',
    'favicon.ico',
  )
  const DEFAULT_IMAGE_CONTENT_TYPE = 'image/x-icon' // Or 'image/png', 'image/svg+xml' etc.

  // let targetImageUrl: string
  let imageResponse: Response | null = null // Initialize as null
  let isDefaultImageServed = false

  if (!imageUrl) {
    console.warn(
      'Image URL is missing. Preparing to serve default image (favicon).',
    )
    isDefaultImageServed = true
  }
  // TODO: make a whitelist of allowed domains
  // const ALLOWED_EXTERNAL_DOMAINS = []

  // if (!ALLOWED_EXTERNAL_DOMAINS.includes(parsedUrl.hostname)) {
  //   const parsedUrl = new URL(imageUrl)
  //   console.warn(
  //     `External image domain not allowed: ${parsedUrl.hostname}. Serving default image.`,
  //   )
  //   isDefaultImageServed = true
  // }

  // If we've decided to serve the default image due to missing/invalid URL or blocked domain
  if (isDefaultImageServed) {
    try {
      // Read the default image file directly from the filesystem
      const defaultImageBuffer = await fs.readFile(DEFAULT_IMAGE_FILE_PATH)
      // Create a new Response with the buffer
      imageResponse = new NextResponse(defaultImageBuffer, {
        status: 200,
        headers: {
          'Content-Type': DEFAULT_IMAGE_CONTENT_TYPE,
          // Apply specific cache-control for the default image (can be aggressive)
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        },
      })
      // Add the rate limiting headers to the default image response
      headers.forEach((value, key) => imageResponse?.headers.set(key, value))
    } catch (defaultImageError) {
      console.error(
        'Failed to read default image from filesystem:',
        defaultImageError,
      )
      return NextResponse.json(
        {
          error: 'Could not retrieve any image, including the default favicon.',
        },
        { status: 500, headers },
      )
    }
  } else {
    // Proceed with fetching the external image
    try {
      const response = await fetchImage(imageUrl as string) // targetImageUrl is guaranteed to be set here
      const contentType = response.headers.get('Content-Type')

      if (contentType && contentType.startsWith('image/')) {
        imageResponse = response
        // Apply aggressive caching headers for successfully proxied external images
        headers.set('Cache-Control', 'public, max-age=31536000, immutable') // Cache for 1 year, immutable
        // Get the content type from the successfully retrieved image
        if (contentType) {
          headers.set('Content-Type', contentType)
        }
      } else {
        console.warn(
          `Fetched resource from ${imageUrl} is not an image (Content-Type: ${contentType}). Serving default image.`,
        )
        // If it's not an image, fall through to try fetching the default image directly
        isDefaultImageServed = true // Set flag to true to re-enter default image serving logic
      }
    } catch (error) {
      console.error(
        `Error fetching or validating image from ${imageUrl}:`,
        error,
      )
      isDefaultImageServed = true // Set flag to true to re-enter default image serving logic
    }

    // IMPORTANT: If 'isDefaultImageServed' was just set true in the catch/else block above,
    // we need to re-attempt serving the default image.
    if (isDefaultImageServed && !imageResponse) {
      // Only if not already handled as default earlier
      try {
        const defaultImageBuffer = await fs.readFile(DEFAULT_IMAGE_FILE_PATH)
        imageResponse = new NextResponse(defaultImageBuffer, {
          status: 200,
          headers: {
            'Content-Type': DEFAULT_IMAGE_CONTENT_TYPE,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
        // Add the rate limiting headers to the default image response
        headers.forEach((value, key) => imageResponse?.headers.set(key, value))
      } catch (defaultImageError) {
        console.error(
          'Failed to read default image from filesystem (second attempt):',
          defaultImageError,
        )
        return NextResponse.json(
          {
            error:
              'Could not retrieve any image, including the default favicon.',
          },
          { status: 500, headers },
        )
      }
    }
  }

  // If, for some reason, imageResponse is still null (shouldn't happen with current logic),
  // provide a final fallback.
  if (!imageResponse) {
    return NextResponse.json(
      { error: 'An unexpected error occurred and no image could be served.' },
      { status: 500, headers },
    )
  }

  // Return the image directly (this will be the external image's response or the first default image response)
  // Note: If you have already set headers on 'imageResponse' when creating it for default image,
  // and also updated 'headers' object for external image, you might need to merge them carefully.
  // The current approach assumes 'headers' object is mutated and then applied at the end.
  return new NextResponse(imageResponse.body, {
    status: imageResponse.status, // Preserve status from original fetch
    headers: headers, // Use the headers object that now includes rate limit and final image headers
  })
}

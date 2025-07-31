import { ratelimit } from '@/utils/rateLimit'
import { NextRequest, NextResponse } from 'next/server'

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
        // Optionally, you can treat this as an error and fall back,
        // or proceed and allow the image to be downloaded to check its actual size later.
        // For strictness, you might throw an error here.
        // For this example, we'll proceed if we can't parse it.
      } else if (contentLength > MAX_IMAGE_SIZE_BYTES) {
        console.warn(
          `Fetched image from ${url} is too large (${contentLength} bytes, limit ${MAX_IMAGE_SIZE_BYTES} bytes).`,
        )
        throw new Error('Image too large') // Throw to trigger the default image fallback
      }
    }
    // else: If Content-Length header is not present, the image will be downloaded regardless
    // and its size won't be known until the full body is received.
    // For very strict limits, you might want to consider streaming the response body
    // and aborting if it exceeds the limit, but that adds complexity.
    // For most cases, relying on Content-Length is a good first step.

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

  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host')
  const baseURL = `${protocol}://${host}`
  const ABSOLUTE_DEFAULT_IMAGE_URL = `${baseURL}/favicon.ico`

  let targetImageUrl: string

  if (!imageUrl) {
    console.warn('Image URL is missing. Serving default image (favicon).')
    targetImageUrl = ABSOLUTE_DEFAULT_IMAGE_URL
  } else {
    targetImageUrl = imageUrl
  }

  let imageResponse: Response

  try {
    const response = await fetchImage(targetImageUrl)
    const contentType = response.headers.get('Content-Type')

    // Validate Content-Type
    if (contentType && contentType.startsWith('image/')) {
      imageResponse = response
    } else {
      console.warn(
        `Fetched resource from ${targetImageUrl} is not an image (Content-Type: ${contentType}). Serving default image.`,
      )
      // If it's not an image, fall through to fetch the default image
      throw new Error('Not an image content type') // Throw to enter the catch block
    }
  } catch (error) {
    console.error(
      `Error fetching or validating image from ${targetImageUrl}:`,
      error,
    )
    // If fetching the requested image fails or it's not an image, try fetching the default image.
    try {
      console.log(
        'Attempting to fetch default image (favicon) using absolute URL...',
      )
      imageResponse = await fetchImage(ABSOLUTE_DEFAULT_IMAGE_URL)
    } catch (defaultImageError) {
      console.error(
        'Failed to fetch default image (favicon):',
        defaultImageError,
      )
      // If even the default image can't be fetched, return a generic error.
      return NextResponse.json(
        {
          error: 'Could not retrieve any image, including the default favicon.',
        },
        { status: 500, headers },
      )
    }
  }

  // Get the content type from the successfully retrieved image (either original or default)
  const finalContentType = imageResponse.headers.get('Content-Type')

  if (finalContentType) {
    headers.set('Content-Type', finalContentType)
  }

  headers.set('Cache-Control', 'public, max-age=31536000, immutable') // Cache for 1 year, immutable

  // Return the image directly
  return new NextResponse(imageResponse.body, {
    status: 200,
    headers: headers,
  })
}

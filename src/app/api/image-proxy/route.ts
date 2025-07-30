import { ratelimit } from '@/utils/rateLimit'
import { NextRequest, NextResponse } from 'next/server'

async function fetchImage(url: string): Promise<Response> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`,
    )
  }
  return response
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
    // TODO: Add a simple validation to prevent abuse?
    // For example, only allow image URLs from certain trusted external domains.
    // This is crucial for security and to prevent your proxy from being used maliciously.
    // const allowedDomains = ['example.com', 'another-api-source.org'];
    // const parsedUrl = new URL(imageUrl);
    // if (!allowedDomains.includes(parsedUrl.hostname)) {
    //   console.warn(`External image domain not allowed: ${parsedUrl.hostname}. Serving default image (favicon).`);
    //   targetImageUrl = ABSOLUTE_DEFAULT_IMAGE_URL;
    // } else {
    // targetImageUrl = imageUrl
    targetImageUrl = ABSOLUTE_DEFAULT_IMAGE_URL
    // }
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

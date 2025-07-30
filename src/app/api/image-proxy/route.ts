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
        { status: 500 },
      )
    }
  }

  // Get the content type from the successfully retrieved image (either original or default)
  const finalContentType = imageResponse.headers.get('Content-Type')

  // Create new headers for the response
  const responseHeaders = new Headers()
  if (finalContentType) {
    responseHeaders.set('Content-Type', finalContentType)
  }

  responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable') // Cache for 1 year, immutable

  // Return the image directly
  return new NextResponse(imageResponse.body, {
    status: 200,
    headers: responseHeaders,
  })
}

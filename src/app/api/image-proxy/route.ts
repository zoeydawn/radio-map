// src/app/api/image-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Image URL is required.' },
      { status: 400 },
    )
  }

  // TODO: Add a simple validation to prevent abuse?
  // For example, only allow image URLs from certain trusted external domains.
  // This is crucial for security and to prevent your proxy from being used maliciously.
  // const allowedDomains = ['example.com', 'another-api-source.org'];
  // const parsedUrl = new URL(imageUrl);
  // if (!allowedDomains.includes(parsedUrl.hostname)) {
  //   return NextResponse.json({ error: 'External image domain not allowed.' }, { status: 403 });
  // }

  // TODO: Rate Limiting: 
  // Implement rate limiting on your proxy endpoint to prevent abuse and protect your server resources.

  // TODO: Max File Size: 
  // Consider adding a check to ensure the fetched image isn't excessively large, which could lead to memory issues or slow responses. 
  // You can check response.headers.get('Content-Length') (though not always present) or set a timeout on the fetch request.

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      console.error(
        `Failed to fetch external image: ${response.status} ${response.statusText}`,
      )
      return NextResponse.json(
        { error: `Failed to fetch external image: ${response.statusText}` },
        { status: response.status },
      )
    }

    // Get the content type from the original response headers
    const contentType = response.headers.get('Content-Type')

    // Create a new response with the image data and content type
    const responseHeaders = new Headers()
    if (contentType) {
      responseHeaders.set('Content-Type', contentType)
    }
    // Add caching headers to prevent re-fetching the image frequently
    // Adjust max-age based on how often external images might change
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable') // Cache for 1 year

    // Return the image directly
    return new NextResponse(response.body, {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error while fetching image.' },
      { status: 500 },
    )
  }
}

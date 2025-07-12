import { NextRequest, NextResponse } from 'next/server' // Import from next/server for App Router APIs

const IPIFY_TOKEN = process.env.IPIFY_TOKEN

// First we get the client's IP address,
// then use that to estimate their location
export async function GET(request: NextRequest) {
  let clientIp: string | undefined

  // I've been lead to beleave that 'request.ip' should work when deployed on Vercel.
  if (request.ip) {
    clientIp = request.ip
  } else {
    // Fallback to 'x-forwarded-for' if 'request.ip' is not available
    const xForwardedFor = request.headers.get('x-forwarded-for')
    if (xForwardedFor) {
      // x-forwarded-for can be a comma-separated list of IPs
      clientIp = xForwardedFor.split(',')[0].trim()
    }
  }

  // for development purposes only!
  if (clientIp === '::ffff:127.0.0.1') {
    // clientIp = '8.8.8.8'
    clientIp = undefined
  }

  if (clientIp) {
    // Return a standard Web Response object

    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_TOKEN}&ipAddress=${clientIp}`,
      )
      const responseData = await response.json()

      return NextResponse.json({ ...responseData }, { status: 200 })
    } catch (error) {
      console.error('error fetching client location', error)

      return NextResponse.json(
        { error: 'Unable to determine client location.' },
        { status: 500 },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Unable to determine IP address.' },
      { status: 500 },
    )
  }
}

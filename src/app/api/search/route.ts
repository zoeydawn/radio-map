import { searchStations } from '@/services/radioBrowserService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const allParams = Object.fromEntries(searchParams.entries())
    console.log('allParams:', allParams)

    // TODO: we might have to format some of the params
    const results = await searchStations(allParams)

    return NextResponse.json({
      message: 'Successfully processed a request with multiple parameters.',
      searchParams: allParams,
      // You would include your fetched data here
      data: results,
    })
  } catch (error) {
    console.error('error calling searchStations:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

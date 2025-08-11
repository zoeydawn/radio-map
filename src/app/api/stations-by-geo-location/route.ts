import { stationsByGeographicArea } from '@/services/radioBrowserService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { geo_lat, geo_long } = Object.fromEntries(searchParams.entries())
    const results = await stationsByGeographicArea(+geo_lat, +geo_long)

    return NextResponse.json({
      message: 'Successfully processed a request geo_lat and geo_long.',
      params: { geo_lat, geo_long },
      data: results,
    })
  } catch (error) {
    console.error('error calling stationsByGeographicArea:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

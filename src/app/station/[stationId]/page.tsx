import StationInfo from '@/components/StationInfo'
import { stationsById } from '@/services/radioBrowserService'
import { simpleStationDiscription } from '@/utils/radioStations'
import { Metadata } from 'next'
import { headers } from 'next/headers'

// Define the base URL for production
// TODO: update this once domain is set up
const productionUrl = 'https://radio-map-eosin.vercel.app'

interface StationPageProps {
  params: Promise<{
    stationId: string // This matches the folder name [stationId]
  }>
}

// generateMetadata function to dynamically set page title and other metadata
export async function generateMetadata(
  props: StationPageProps,
): Promise<Metadata> {
  try {
    const params = await props.params
    const stationArray = (await stationsById(params.stationId)) || []
    const station = stationArray[0]

    if (!station) {
      return {
        title: 'Station Not Found', // Default title if item is not found
      }
    }

    // Dynamically get the base URL from the request headers
    const rawHeaders = await headers()
    const host = rawHeaders.get('host')

    const protocol =
      host && (host.startsWith('localhost') || host.startsWith('127.0.0.1'))
        ? 'http'
        : 'https'
    const baseUrl = host ? `${protocol}://${host}` : productionUrl

    const stationUrl = `${baseUrl}/station/${station.id}`
    const imageUrl = station.favicon || `${baseUrl}/default-image.jpg`

    return {
      title: station.name, // Set the page title to the item's name
      description: simpleStationDiscription(station),
      openGraph: {
        // Open Graph metadata for social media sharing
        title: station.name,
        description: simpleStationDiscription(station),
        url: stationUrl,
        images: [
          {
            url: imageUrl,
            width: 150,
            height: 150,
            alt: station.name,
          },
        ],
      },
      twitter: {
        // Twitter Card metadata
        card: 'summary_large_image',
        title: station.name,
        description: simpleStationDiscription(station),
        images: [imageUrl],
      },
    }
  } catch (error) {
    console.error('error fetching station:', error)
    return { title: 'Error, Station Not Found' }
  }
}

export default async function StationPage(props: StationPageProps) {
  const params = await props.params
  const stationArray = (await stationsById(params.stationId)) || []
  const station = stationArray[0]

  if (!station) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="p-8 rounded-lg shadow-xl max-w-2xl w-full">
          <h1 className="text-4xl font-extrabold mb-4 rounded-md p-2 ">
            Not found
          </h1>
          <p className=" text-base border-l-4  pl-4 py-2 rounded-md">
            We could not find that station
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <StationInfo station={station} theme={'dark'} />
      </div>
    </div>
  )
}

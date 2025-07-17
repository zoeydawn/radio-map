// This is a Server Component, meaning it runs on the server.
// Data fetching can be done directly here.

import StationInfo from '@/components/StationInfo'
import { stationsById } from '@/services/radioBrowserService'
import { simpleStationDiscription } from '@/utils/radioStations'
import { Metadata } from 'next'

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

    return {
      title: station.name, // Set the page title to the item's name
      description: simpleStationDiscription(station),
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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <StationInfo station={station} theme={'dark'} />
      </div>
    </div>
  )
}

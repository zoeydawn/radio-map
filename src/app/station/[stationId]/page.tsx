// This is a Server Component, meaning it runs on the server.
// Data fetching can be done directly here.

import StationInfo from '@/components/StationInfo'
import { stationsById } from '@/services/radioBrowserService'

interface ItemPageProps {
  params: {
    stationId: string // This matches the folder name [stationId]
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { stationId } = params

  const stationArray = (await stationsById(stationId)) || []
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

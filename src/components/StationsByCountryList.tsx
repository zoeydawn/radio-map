'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'
import { stationsByCountryCode } from '@/services/radioBrowserService'
import { Station } from 'radio-browser-api'
import { useState } from 'react'

interface StationsByCountryListProps {
  initialStations: Station[]
  countryName: string
  countryCode: string
}

const StationsByCountryList: React.FC<StationsByCountryListProps> = ({
  initialStations,
  countryName,
  countryCode,
}) => {
  const [radioStations, setRadioStations] = useState<Station[]>([])
  const [offset, setOffset] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const { setViewedStation } = useAppContext()

  const allStations = [...initialStations, ...radioStations]

  const getStations = async () => {
    setLoading(true)
    const stations = await stationsByCountryCode(countryCode, offset)
    // console.log('stations:', stations)

    setRadioStations([...radioStations, ...stations])
    setOffset(offset + 1)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center ">
      <div className="w-full max-w-200 p-2">
        <StationList
          stations={allStations}
          setViewedStation={setViewedStation}
          header={`Radio stations in ${countryName}`}
          isLoading={loading}
        />

        {!loading && (
          <button onClick={getStations} className="btn btn-soft btn-primary">
            Load more
          </button>
        )}
      </div>
    </div>
  )
}

export default StationsByCountryList

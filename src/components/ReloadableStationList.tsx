'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'
import { searchStations } from '@/services/radioBrowserService'
import { AdvancedStationQuery, Station } from 'radio-browser-api'
import { useState } from 'react'

interface ReloadableStationListProps {
  initialStations: Station[]
  header: string
  searchParams: AdvancedStationQuery
}

const ReloadableStationList: React.FC<ReloadableStationListProps> = ({
  initialStations,
  header,
  searchParams,
}) => {
  const [radioStations, setRadioStations] = useState<Station[]>([])
  const [offset, setOffset] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const { setViewedStation } = useAppContext()

  const allStations = [...initialStations, ...radioStations]

  const getStations = async () => {
    setLoading(true)
    const stations = await searchStations({ ...searchParams, offset })

    setRadioStations([...radioStations, ...stations])
    setOffset(offset + 1)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-200 p-2">
        <StationList
          stations={allStations}
          setViewedStation={setViewedStation}
          header={header}
          isLoading={loading}
          onLoadMore={getStations}
        />
      </div>
    </div>
  )
}

export default ReloadableStationList

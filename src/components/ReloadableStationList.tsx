'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'
import { searchStations, step } from '@/services/radioBrowserService'
import { AdvancedStationQuery, Station } from 'radio-browser-api'
import { useEffect, useState } from 'react'

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
  const [areMoreStationsToLoad, setAreMoreStationsToLoad] =
    useState<boolean>(true)
  const { setViewedStation } = useAppContext()

  const allStations = [...initialStations, ...radioStations]

  const getStations = async () => {
    setLoading(true)
    const stations = await searchStations({ ...searchParams, offset })

    setRadioStations([...radioStations, ...stations])
    setOffset(offset + 1)
    if (stations.length < step) {
      setAreMoreStationsToLoad(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (initialStations.length < step) {
      setAreMoreStationsToLoad(false)
    }
  }, [initialStations])

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-200 p-2">
        <StationList
          stations={allStations}
          setViewedStation={setViewedStation}
          header={header}
          isLoading={loading}
          onLoadMore={getStations}
          hideLoadButton={!areMoreStationsToLoad}
        />
      </div>
    </div>
  )
}

export default ReloadableStationList

'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'
import { stationsByVotes } from '@/services/radioBrowserService'
import { Station } from 'radio-browser-api'
import { useEffect, useState } from 'react'

export default function Popular() {
  const [radioStations, setRadioStations] = useState<Station[]>([])
  const { setViewedStation } = useAppContext()

  const getStations = async () => {
    const stations = await stationsByVotes()
    // console.log('stations:', stations)

    setRadioStations(stations)
  }

  useEffect(() => {
    getStations()
  }, [])

  return (
    <>
      <StationList
        stations={radioStations}
        setViewedStation={setViewedStation}
        header="Popular stations"
      />
    </>
  )
}

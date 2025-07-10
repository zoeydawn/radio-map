'use client'

import Loader from '@/components/Loader'
import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'

export default function Stations() {
  const { radioStations, isLoading } = useAppContext()
  // console.log('radioStations in list:', radioStations)

  return (
    <>
      <StationList stations={radioStations} header="Stations near you" />
      {isLoading && <Loader />}
    </>
  )
}

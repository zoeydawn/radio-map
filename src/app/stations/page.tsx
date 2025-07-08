'use client'

import Loader from '@/components/Loader'
import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'

export default function Stations() {
  const { radioStations, isLoading } = useAppContext()
  console.log('radioStations in list:', radioStations)

  return (
    <>
      <StationList stations={radioStations} header="this is a list" />
      {isLoading && <Loader />}
    </>
  )
}

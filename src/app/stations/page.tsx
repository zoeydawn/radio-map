'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'

export default function Stations() {
  const { radioStations } = useAppContext()
  console.log('radioStations in list:', radioStations)

  return <StationList stations={radioStations} header="this is a list" />
}

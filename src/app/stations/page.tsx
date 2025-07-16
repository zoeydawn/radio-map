'use client'

import Loader from '@/components/Loader'
// import StationList from '@/components/StationList'
// import { useAppContext } from '@/context/AppContext'

export default function Stations() {
  // const { radioStations, isLoading, setViewedStation } = useAppContext()
  // console.log('radioStations in list:', radioStations)

  return (
    <>
      {/* <StationList
        stations={radioStations}
        setViewedStation={setViewedStation}
        header="Stations near you"
      />
      {isLoading && <Loader />} */}
      <Loader />
    </>
  )
}

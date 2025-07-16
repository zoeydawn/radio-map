import MapView from '@/components/MapView'
import { MapViewProvider } from '@/context/MapContext'
// import StationList from '@/components/StationList'
// import WorldMap from '@/components/WorldMap'
// import { MapProvider } from 'react-map-gl/mapbox'
// import { useAppContext } from '@/context/AppContext'
// import { useState } from 'react'

export default function Home() {
  // const [view, setView] = useState<'map' | 'list'>('map')
  // const { radioStations, isLoading, setViewedStation } = useAppContext()

  // const toggleView = () => {
  //   setView(view === 'map' ? 'list' : 'map')
  //   // TODO: save view in local storage?
  // }

  return (
    <MapViewProvider>
      <MapView />
    </MapViewProvider>
  )
}

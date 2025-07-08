'use client'

import * as React from 'react'
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'
import Pins from './Pins'
import Loader from './Loader'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function WorldMap() {
  const {
    theme,
    isLoading,
    viewState,
    setViewState,
    // getStationsByLatAndLong,
    radioStations,
  } = useAppContext()
  // const { latitude, longitude } = viewState

  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v9'
      : 'mapbox://styles/mapbox/streets-v9'

  // React.useEffect(() => {
  //   // TODO: add logic to reload stations when the map is moved
  //   // TODO: check if stations are already loaded to avoid refetching
  //   // if (stations.length === 0) {
  //   getStationsByLatAndLong(latitude, longitude)
  //   // }
  // }, [latitude, longitude, getStationsByLatAndLong])

  // TODO: there is a weird issue with the map not re-rendering when data changes

  // We only want to show the loading spinner initially when there are no stations in the state.
  // We still want to display the map when fetching additional stations.
  // Because when moving the map, we fetch additional stations but we don't delete the existing stations from state.
  if (isLoading && !radioStations.length) {
    return <Loader />
  }

  return (
    <div>
      <Map
        viewState={{ ...viewState, width: 0, height: 0 }} // "width" and "hight" are added here to make TS happy. They don't actually have any effect
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: 800 }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        <Pins />
      </Map>
    </div>
  )
}

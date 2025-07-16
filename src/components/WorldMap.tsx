'use client'

import * as React from 'react'
import Map from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'
import Pins from './Pins'
import Loader from './Loader'
import { useMapContext } from '@/context/MapContext'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function WorldMap() {
  const { theme } = useAppContext()
  const {
    isLoading,
    viewState,
    setViewState,
    getStationsByLatAndLong,
    radioStations,
  } = useMapContext()

  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v9'
      : 'mapbox://styles/mapbox/streets-v9'

  // We only want to show the loading spinner initially when there are no stations in the state.
  // We still want to display the map when fetching additional stations.
  // Because when moving the map, we fetch additional stations but we don't delete the existing stations from state.
  if (isLoading && !radioStations.length) {
    return <Loader />
  }
  // console.log('radiostations in WorldMap:', radioStations)

  return (
    <div>
      <Map
        viewState={{ ...viewState, width: 0, height: 0 }} // "width" and "hight" are added here to make TS happy. They don't actually have any effect
        onMove={(evt) => setViewState(evt.viewState)}
        onMoveEnd={(evt) => {
          // console.log({ evt })
          getStationsByLatAndLong(
            evt.viewState.latitude,
            evt.viewState.longitude,
          )
        }}
        style={{ width: '100%', height: 800 }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Pins />
      </Map>
    </div>
  )
}

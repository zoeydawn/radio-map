'use client'

import * as React from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function WorldMap() {
  const { theme, viewState, setViewState, getStationsByLatAndLong } =
    useAppContext()
  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v9'
      : 'mapbox://styles/mapbox/streets-v9'

  React.useEffect(() => {
    // TODO: add logic to reload stations when the map is moved
    // TODO: check if stations are already loaded to avoid refetching
    // if (stations.length === 0) {
    getStationsByLatAndLong()
    // }
  }, [])

  return (
    <div>
      <Map
        viewState={{ ...viewState, width: 0, height: 0 }} // "width" and "hight" are added here to make TS happy. They don't actually have any effect
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: 800 }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={-122.4} latitude={37.8} color="red" />
      </Map>
    </div>
  )
}

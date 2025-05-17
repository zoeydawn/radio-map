'use client'

import * as React from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function WorldMap() {
  const { state } = useAppContext()
  const mapStyle =
    state.theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v9'
      : 'mapbox://styles/mapbox/streets-v9'

  return (
    <div>
      <Map
        initialViewState={{
          latitude: 37.8,
          longitude: -122.4,
          zoom: 14,
        }}
        style={{ width: '100%', height: 800 }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={-122.4} latitude={37.8} color="red" />
      </Map>
    </div>
  )
}

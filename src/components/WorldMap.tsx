'use client'

import * as React from 'react'
import Map, { ViewStateChangeEvent } from 'react-map-gl/mapbox'

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
    setIsLoading,
    getStationsByLatAndLong,
    setViewState,
  } = useMapContext()

  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v9'
      : 'mapbox://styles/mapbox/streets-v9'

  const handleMoveEnd = (evt: ViewStateChangeEvent) => {
    // console.log('evt:', evt)
    // keep track of viewState for clustering

    setViewState(evt.viewState)
    // prevent multiple api requests at once
    if (!isLoading) {
      setIsLoading(true)

      getStationsByLatAndLong(evt.viewState.latitude, evt.viewState.longitude)
    }
  }

  return (
    <div className="absolute bottom-0 top-0 left-0 right-0 pt-18">
      {isLoading && (
        <div className="absolute left-4 top-17 z-50">
          <Loader />
        </div>
      )}
      <Map
        initialViewState={viewState}
        onMoveEnd={handleMoveEnd}
        maxZoom={20}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Pins />
      </Map>
    </div>
  )
}

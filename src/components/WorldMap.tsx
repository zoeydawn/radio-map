'use client'

import * as React from 'react'
import * as GeoJSON from 'geojson'
import Map, {
  Layer,
  MapRef,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'
import Pins from './Pins'
import Loader from './Loader'
import { useMapContext } from '@/context/MapContext'
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from './layers'
import { MapMouseEvent } from 'mapbox-gl'
import { radioStationList } from '@/context/radioStationList'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const radioStations = radioStationList

export default function WorldMap() {
  const { theme } = useAppContext()
  const {
    isLoading,
    viewState,
    setIsLoading,
    // radioStations,
    getStationsByLatAndLong,
  } = useMapContext()

  const mapRef = React.useRef<MapRef>(null)

  const onClick = (event: MapMouseEvent) => {
    // if ()
    const feature = event.features[0]

    console.log('feature', feature)
    console.log('event...', event)
    const clusterId = feature.properties.cluster_id

    const mapboxSource = mapRef.current.getSource(
      'radio stations',
    ) as GeoJSONSource

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return
      }

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      })
    })
  }

  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v9'
      : 'mapbox://styles/mapbox/streets-v9'

  const handleMoveEnd = (evt: ViewStateChangeEvent) => {
    // prevent multiple api requests at once
    if (!isLoading) {
      setIsLoading(true)

      getStationsByLatAndLong(evt.viewState.latitude, evt.viewState.longitude)
    }
  }

  // const geoStations: FeatureCollection = radioStations.map((station) => {
  //   station.geoLat, station.geoLong
  // })

  const geojsonStations = GeoJSON.parse(radioStations, {
    Point: ['geoLat', 'geoLong'],
  })

  console.log('geojsonStations:', geojsonStations)
  console.log('radioStations:', radioStations)

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
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer?.id || '']}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id="radio stations"
          type="geojson"
          data={geojsonStations}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          {/* <Layer {...unclusteredPointLayer} /> */}
          <Layer {...unclusteredPointLayer} />
          {/* <Pins /> */}
        </Source>
      </Map>
    </div>
  )
}

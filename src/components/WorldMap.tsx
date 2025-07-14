'use client'

import * as React from 'react'
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  Source,
  Layer,
  MapRef,
  ViewState,
} from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'
// import Pins from './Pins'
import Loader from './Loader'
import { GeoJSONSource, MapMouseEvent } from 'mapbox-gl'

import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from './layers'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function WorldMap() {
  const {
    theme,
    isLoading,
    // viewState,
    // setViewState,
    getStationsByLatAndLong,
    radioStations,
  } = useAppContext()

  const mapRef = React.useRef<MapRef>(null)

  const onClick = (event: MapMouseEvent) => {
    console.log('event:', event)
    // const feature = event?.features?.[0]

    // // if (feature && feature.properties) {
    // const clusterId = feature.properties.cluster_id
    // console.log('clusterId:', clusterId)

    // // if (mapRef.current) {
    // const mapboxSource = mapRef.current.getSource(
    //   'earthquakes',
    // ) as GeoJSONSource

    // mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
    //   if (err) {
    //     return
    //   }

    //   mapRef.current.easeTo({
    //     center: feature.geometry.coordinates,
    //     zoom,
    //     duration: 500,
    //   })
    // })
    // // }

    const feature = event.features[0]
    const clusterId = feature.properties.cluster_id

    const mapboxSource = mapRef.current.getSource(
      'earthquakes',
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

  // We only want to show the loading spinner initially when there are no stations in the state.
  // We still want to display the map when fetching additional stations.
  // Because when moving the map, we fetch additional stations but we don't delete the existing stations from state.
  if (isLoading && !radioStations.length) {
    return <Loader />
  }
  // console.log('radiostations in WorldMap:', radioStations)
  const sourceData = radioStations.map((station) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [station.geoLong, station.geoLat],
        properties: { ...station },
      },
    }
  })

  // {
  //   type: 'FeatureCollection',
  //   features: [
  //     {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}}
  //   ]
  // };

  const initialViewState: ViewState = {
    longitude: -73.7, // default to Montreal
    latitude: 45.5,
    zoom: 8.5,
    bearing: 0,
    pitch: 0,
    padding: {},
  }

  return (
    <div>
      <Map
        // viewState={{ ...viewState, width: 0, height: 0 }} // "width" and "hight" are added here to make TS happy. They don't actually have any effect
        // onMove={(evt) => setViewState(evt.viewState)}
        initialViewState={initialViewState}
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
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        {' '}
        <Source
          id="radio stations"
          type="geojson"
          // data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          data={{
            type: 'FeatureCollection',
            features: sourceData,
          }}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        {/* <Pins /> */}
      </Map>
    </div>
  )
}

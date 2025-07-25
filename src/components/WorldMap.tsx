'use client'

import * as React from 'react'
import * as GeoJSON from 'geojson'
import Map, {
  Layer,
  MapRef,
  Marker,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl/mapbox'

import { useAppContext } from '../context/AppContext'

import 'mapbox-gl/dist/mapbox-gl.css'
import Pins, { Pin } from './Pins'
import Loader from './Loader'
import { useMapContext } from '@/context/MapContext'
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from './layers'
import { MapMouseEvent } from 'mapbox-gl'
import { radioStationList } from '@/context/radioStationList'
import useSupercluster from 'use-supercluster'

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

  // const onClick = (event: MapMouseEvent) => {
  //   // if ()
  //   const feature = event.features[0]

  //   console.log('feature', feature)
  //   console.log('event...', event)
  //   const clusterId = feature.properties.cluster_id

  //   const mapboxSource = mapRef.current.getSource(
  //     'radio stations',
  //   ) as GeoJSONSource

  //   mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
  //     if (err) {
  //       return
  //     }

  //     mapRef.current.easeTo({
  //       center: feature.geometry.coordinates,
  //       zoom,
  //       duration: 500,
  //     })
  //   })
  // }

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

  // const geojsonStations = GeoJSON.parse(radioStations, {
  //   Point: ['geoLat', 'geoLong'],
  // })

  const points = radioStations.map((radioStation) => ({
    type: 'Feature',
    properties: { cluster: false, stationId: radioStation.id },
    geometry: {
      type: 'Point',
      coordinates: [radioStation.geoLong, radioStation.geoLat],
    },
  }))

  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: 8.5,
    options: { radius: 75, maxZoom: 20 },
  })

  console.log('geojsonStations:', points)
  console.log('clusters:', clusters)

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
        onClick={() => {}}
        ref={mapRef}
      >
        {/* <Source
          id="radio stations"
          type="geojson"
          data={geojsonStations}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          {/* <Layer {...unclusteredPointLayer} /> 
          <Layer {...unclusteredPointLayer} />
        </Source> */}
        {/* <Pins /> */}

        {clusters.map((cluster) => {
          console.log('cluster:', cluster)
          const [longitude, latitude] = cluster.geometry.coordinates
          const {
            cluster: isCluster,
            stationId,
            cluster_id,
            point_count,
          } = cluster.properties

          if (isCluster) {
            // return null
            return (
              <Marker
                key={`cluster-${cluster_id}`}
                latitude={latitude}
                longitude={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (point_count / points.length) * 20}px`,
                    height: `${10 + (point_count / points.length) * 20}px`,
                  }}
                  onClick={() => {
                    console.log('click')
                    // const expansionZoom = Math.min(
                    //   supercluster.getClusterExpansionZoom(cluster.id),
                    //   20,
                    // )

                    // setViewport({
                    //   ...viewport,
                    //   latitude,
                    //   longitude,
                    //   zoom: expansionZoom,
                    //   transitionInterpolator: new FlyToInterpolator({
                    //     speed: 2,
                    //   }),
                    //   transitionDuration: 'auto',
                    // })
                  }}
                >
                  {point_count}
                </div>
              </Marker>
            )
          }

          return (
            // <Marker
            //   key={`crime-${cluster.id}`}
            // >
            //   <button className="crime-marker">
            //     <img src="/custody.svg" alt="crime doesn't pay" />
            //   </button>
            // </Marker>

            <Marker
              key={`marker-${stationId}`}
              // longitude={radioStation.geoLong}
              // latitude={radioStation.geoLat}

              latitude={latitude}
              longitude={longitude}
              anchor="bottom"
              onClick={(e) => {
                // console.log({ e, radioStation })
                // If we let the click event propagates to the map, it will immediately close the popup
                // with `closeOnClick: true`
                e.originalEvent.stopPropagation()
                // setViewedStation(radioStation)
              }}
            >
              <Pin />
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}

import * as React from 'react'
import { useAppContext } from '../context/AppContext'

import { Marker } from 'react-map-gl/mapbox'
import { useMapContext } from '@/context/MapContext'
import { RadioMapIcon } from './Icons'
import useSupercluster from 'use-supercluster'

// import { radioStationList } from '@/context/radioStationList'
// const radioStations = radioStationList

interface ClusterMarkerProps {
  children: React.ReactNode
  style: React.CSSProperties
  // Add any other props you might need, like onClick, etc.
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ children, style }) => {
  return (
    <div
      className="flex justify-center items-center rounded-full p-2.5 text-white"
      style={{
        backgroundColor: '#1978c8', // Custom background color
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const pinStyle = {
  cursor: 'pointer',
  stroke: 'none',
}

export default function Pins() {
  const { setViewedStation } = useAppContext()
  const { radioStations, mapRef, viewState } = useMapContext()

  const points = radioStations.map((station) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      stationId: station.id,
      // category: station.category,
      station,
    },
    geometry: {
      type: 'Point',
      coordinates: [station.geoLong, station.geoLat],
    },
  }))

  const bounds = mapRef.current
    ? mapRef.current?.getMap()?.getBounds()?.toArray().flat()
    : null

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    options: { radius: 75, maxZoom: 20 },
  })

  // console.log({ clusters, supercluster, bounds, mapRef })
  return (
    <>
      {clusters.map((cluster) => {
        // every cluster point has coordinates
        const [longitude, latitude] = cluster.geometry.coordinates
        // the point may be either a cluster or a crime point
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties

        // we have a cluster to render
        if (isCluster) {
          console.log('cluster:', cluster)
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
            >
              <ClusterMarker
                style={{
                  width: `${10 + (pointCount / points.length) * 20}px`,
                  height: `${10 + (pointCount / points.length) * 20}px`,
                }}
              >
                {pointCount}
              </ClusterMarker>
            </Marker>
          )
        }

        // we have a single point (crime) to render
        return (
          <Marker
            key={`crime-${cluster.properties.stationId}`}
            latitude={latitude}
            longitude={longitude}
            anchor="bottom"
            onClick={(e) => {
              // console.log({ e, radioStation })
              // If we let the click event propagates to the map, it will immediately close the popup
              // with `closeOnClick: true`
              e.originalEvent.stopPropagation()
              setViewedStation(cluster.properties.station)
            }}
          >
            {/* <button className="crime-marker">
              <img src="/custody.svg" alt="crime doesn't pay" />
            </button> */}
            <RadioMapIcon style={pinStyle} className="size-6" />
          </Marker>
        )
      })}

      {/* {React.useMemo(
        () =>
          radioStations.map((radioStation) => {
            // to make typescript happy
            if (radioStation.geoLat && radioStation.geoLong) {
              return (
                <Marker
                  key={`marker-${radioStation.id}`}
                  longitude={radioStation.geoLong}
                  latitude={radioStation.geoLat}
                  anchor="bottom"
                  onClick={(e) => {
                    // console.log({ e, radioStation })
                    // If we let the click event propagates to the map, it will immediately close the popup
                    // with `closeOnClick: true`
                    e.originalEvent.stopPropagation()
                    setViewedStation(radioStation)
                  }}
                >
                  <RadioMapIcon style={pinStyle} className="size-6" />
                </Marker>
              )
            }
          }),
        [radioStations, setViewedStation],
      )} */}
    </>
  )
}

import * as React from 'react'
import { useAppContext } from '../context/AppContext'

import { Marker } from 'react-map-gl/mapbox'
import { useMapContext } from '@/context/MapContext'
import { RadioMapIcon } from './Icons'
import useSupercluster from 'use-supercluster'

const getRadius = (pointCount: number) => {
  if (pointCount > 50) {
    return '24'
  }
  if (pointCount > 25) {
    return '20'
  }
  if (pointCount > 10) {
    return '16'
  }
  if (pointCount > 5) {
    return '10'
  }
  return '6'
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

  return (
    <>
      {React.useMemo(
        () =>
          clusters.map((cluster) => {
            // every cluster point has coordinates
            const [longitude, latitude] = cluster.geometry.coordinates
            // the point may be either a cluster or a crime point
            const { cluster: isCluster, point_count: pointCount } =
              cluster.properties

            // we have a cluster to render
            if (isCluster) {
              const clusterRadius = getRadius(pointCount)

              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  latitude={latitude}
                  longitude={longitude}
                  onClick={() => {
                    if (supercluster) {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(
                          cluster.id as number,
                        ),
                        20,
                      )

                      mapRef.current?.flyTo({
                        center: { lat: latitude, lon: longitude },
                        zoom: expansionZoom,
                      })
                    }
                  }}
                >
                  <div
                    className={`flex justify-center items-center rounded-full p-2.5 w-${clusterRadius} h-${clusterRadius} text-white bg-amber-950`}
                  >
                    {pointCount}
                  </div>
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
                  e.originalEvent.stopPropagation()
                  setViewedStation(cluster.properties.station)
                }}
              >
                <RadioMapIcon style={pinStyle} className="size-6" />
              </Marker>
            )
          }),
        [clusters, supercluster, mapRef, setViewedStation],
      )}

      {/* these are just here to force tailwind to compile these classNames */}
      <div className="w-6 h-6"></div>
      <div className="w-10 h-10"></div>
      <div className="w-16 h-16"></div>
      <div className="w-20 h-20"></div>
      <div className="w-24 h-24"></div>
    </>
  )
}

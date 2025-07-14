// TODO: delete this file. It's only for reference 
'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl, {
  Map,
  GeoJSONSource,
  Popup,
  MapMouseEvent,
  LngLatLike,
  StyleSpecification,
} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Ensure your Mapbox token is correctly configured in your .env.local file
// NEXT_PUBLIC_MAPBOX_TOKEN="YOUR_MAPBOX_ACCESS_TOKEN"
const MAPBOX_TOKEN: string | undefined = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const MapWithClusters: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.error(
        'Mapbox token is not defined. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.',
      )
      return
    }

    mapboxgl.accessToken = MAPBOX_TOKEN

    // Initialize the map only if mapRef.current is null to prevent re-initialization
    if (mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      // UPDATED STYLE OBJECT: Added the 'glyphs' property
      style: {
        version: 8,
        name: 'Dark Map',
        metadata: {
          'mapbox:autocomposite': true,
          'mapbox:type': 'template',
          'mapbox:sdk_support': {
            js: '1.14.0',
            android: '10.0.0',
            ios: '10.0.0',
          },
          'mapbox:config': {
            basemap: {
              theme: 'monochrome',
              lightPreset: 'night',
            },
          },
        },
        sources: {},
        layers: [],
        glyphs: 'mapbox://fonts/{fontstack}/{range}.pbf', // THIS LINE WAS ADDED/FIXED
      } as StyleSpecification,
      center: [-103.5917, 40.6699],
      zoom: 3,
    })

    mapRef.current = map

    map.on('load', () => {
      map.addSource('earthquakes', {
        type: 'geojson',
        generateId: true,
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
          'circle-emissive-strength': 1,
        },
      })

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      })

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          'circle-emissive-strength': 1,
        },
      })

      // inspect a cluster on click
      map.on('click', 'clusters', (e: MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        })
        const clusterId = (features[0].properties as { cluster_id: number })
          .cluster_id
        ;(
          map.getSource('earthquakes') as GeoJSONSource
        ).getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return

          map.easeTo({
            center: (features[0].geometry as GeoJSON.Point)
              .coordinates as LngLatLike,
            zoom: zoom,
          })
        })
      })

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'unclustered-point', (e: MapMouseEvent) => {
        const coordinates = (
          e.features![0].geometry as GeoJSON.Point
        ).coordinates.slice()
        const mag = (e.features![0].properties as { mag: number }).mag
        const tsunami =
          (e.features![0].properties as { tsunami: number }).tsunami === 1
            ? 'yes'
            : 'no'

        new Popup()
          .setLngLat(coordinates as LngLatLike)
          .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
          .addTo(map)
      })

      // Change the cursor to a pointer when the mouse is over a cluster of POIs.
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change the cursor back to a pointer when it stops hovering over a cluster of POIs.
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = ''
      })

      // Change the cursor to a pointer when the mouse is over an individual POI.
      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change the cursor back to a pointer when it stops hovering over an individual POI.
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = ''
      })
    })

    // Clean up map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div>
      <div id="map" ref={mapContainerRef} style={{ height: '1000px' }}></div>
    </div>
  )
}

export default MapWithClusters

'use client'

import StationList from '@/components/StationList'
import WorldMap from '@/components/WorldMap'
import { useAppContext } from '@/context/AppContext'
import { useMapContext } from '@/context/MapContext'
import { useState } from 'react'
import { ListIcon, MapIcon } from './Icons'
import Loader from './Loader'

export default function MapView() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const { setViewedStation } = useAppContext()
  const { radioStations, isLoading } = useMapContext()

  const toggleView = () => {
    setView(view === 'map' ? 'list' : 'map')
    // TODO: save view in local storage?
  }

  // We only want to show the loading spinner initially when there are no stations in the state.
  // We still want to display the map when fetching additional stations.
  // Because when moving the map, we fetch additional stations but we don't delete the existing stations from state.
  if (isLoading && !radioStations.length) {
    return <Loader />
  }

  return (
    <div className="flex justify-center">
      <div className="absolute left-0 right-0 top-16 flex justify-center pt-3">
        <div role="tablist" className="tabs tabs-box w-max  z-20">
          <a
            role="tab"
            onClick={toggleView}
            className={view === 'map' ? 'tab tab-active' : 'tab'}
          >
            <MapIcon /> Map
          </a>
          <a
            role="tab"
            onClick={toggleView}
            className={view === 'list' ? 'tab tab-active' : 'tab'}
          >
            <ListIcon /> List
          </a>
        </div>
      </div>

      {view === 'map' && <WorldMap />}
      {view === 'list' && (
        <div className="pt-8">
          <StationList
            stations={radioStations}
            setViewedStation={setViewedStation}
            header="Stations near you"
            isLoading={isLoading}
            showSearch
          />
        </div>
      )}
    </div>
  )
}

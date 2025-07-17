'use client'

import StationList from '@/components/StationList'
import WorldMap from '@/components/WorldMap'
import { useAppContext } from '@/context/AppContext'
import { useMapContext } from '@/context/MapContext'
import { useState } from 'react'
import { ListIcon, MapIcon } from './Icons'

export default function MapView() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const { setViewedStation } = useAppContext()
  const { radioStations, isLoading } = useMapContext()

  const toggleView = () => {
    setView(view === 'map' ? 'list' : 'map')
    // TODO: save view in local storage?
  }

  return (
    <>
      <div className="flex justify-center pt-3">
        <div role="tablist" className="tabs tabs-lift w-max">
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
            <ListIcon />{' '}
            List
          </a>
        </div>
      </div>

      {view === 'map' && <WorldMap />}
      {view === 'list' && (
        <StationList
          stations={radioStations}
          setViewedStation={setViewedStation}
          header="Stations near you"
          isLoading={isLoading}
        />
      )}
    </>
  )
}

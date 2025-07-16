'use client'

import Loader from '@/components/Loader'
import StationList from '@/components/StationList'
import WorldMap from '@/components/WorldMap'
import { useAppContext } from '@/context/AppContext'
import { useState } from 'react'

export default function Home() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const { radioStations, isLoading, setViewedStation } = useAppContext()

  const toggleView = () => {
    setView(view === 'map' ? 'list' : 'map')
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>{' '}
            Map
          </a>
          <a
            role="tab"
            onClick={toggleView}
            className={view === 'list' ? 'tab tab-active' : 'tab'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>{' '}
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
        />
      )}
      {isLoading && <Loader />}
    </>
  )
}

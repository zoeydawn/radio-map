import * as React from 'react'
import { useAppContext } from '../context/AppContext'

import { Marker } from 'react-map-gl/mapbox'
import { useMapContext } from '@/context/MapContext'

const pinStyle = {
  cursor: 'pointer',
  stroke: 'none',
}

export const Pin = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.001 512" // Keep this viewBox
      fill="currentColor"
      className="size-5" // This will scale it down significantly
      style={pinStyle}
    >
      <g>
        <path d="M48,181.063c0,55.563,21.656,107.813,61,147.125l-33.938,33.938C26.656,313.75,0,249.438,0,181.063s26.625-132.688,75-181 L108.938,34C69.625,73.25,48,125.5,48,181.063z M182.438,107.5L148.5,73.562c-28.688,28.75-44.5,66.938-44.5,107.5 c0,40.625,15.813,78.813,44.563,107.5l33.938-33.938c-19.688-19.625-30.5-45.75-30.5-73.563 C152,153.313,162.813,127.188,182.438,107.5z M436.938,0L403,33.938c39.344,39.313,61,91.563,61,147.125 s-21.625,107.813-60.906,147.125l33.938,33.938c48.344-48.375,74.969-112.688,74.969-181.063C512,112.625,485.344,48.313,436.938,0 z M256,133.063c-26.5,0-48,21.5-48,48c0,17.75,9.719,33.063,24,41.344V512h48V222.438c14.281-8.313,24-23.625,24-41.375 C304,154.563,282.531,133.063,256,133.063z M363.438,73.563L329.5,107.5c19.656,19.688,30.5,45.813,30.5,73.563 c0,27.813-10.812,53.938-30.438,73.563l33.938,33.938c28.688-28.688,44.5-66.875,44.5-107.5S392.188,102.313,363.438,73.563z" />
      </g>
    </svg>
  )
}

export default function Pins() {
  const { setViewedStation } = useAppContext()
  const { radioStations } = useMapContext()

  return (
    <>
      {React.useMemo(
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
                  <Pin />
                </Marker>
              )
            }
          }),
        [radioStations, setViewedStation],
      )}
    </>
  )
}

import * as React from 'react'
import { useAppContext } from '../context/AppContext'

import { Marker } from 'react-map-gl/mapbox'
import { useMapContext } from '@/context/MapContext'
import { RadioMapIcon } from './Icons'

// import { radioStationList } from '@/context/radioStationList'
// const radioStations = radioStationList

const pinStyle = {
  cursor: 'pointer',
  stroke: 'none',
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
                  <RadioMapIcon style={pinStyle} className="size-6" />
                </Marker>
              )
            }
          }),
        [radioStations, setViewedStation],
      )}
    </>
  )
}

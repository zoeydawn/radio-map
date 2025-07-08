import * as React from 'react'
import { useAppContext } from '../context/AppContext'

import { Marker } from 'react-map-gl/mapbox'
import { Station } from 'radio-browser-api'
import { simpleStationDiscription } from '@/utils/radioStations'

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

const pinStyle = {
  cursor: 'pointer',
  fill: '#d00',
  stroke: 'none',
}

const Pin = ({ size = 20 }) => {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  )
}

interface StationModelProps {
  station: Station
  handleClose: () => void
}

const StationModel: React.FC<StationModelProps> = ({
  station,
  handleClose,
}) => (
  <dialog id="my_modal_5" className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg">{station.name}</h3>
      <p className="py-4">{simpleStationDiscription(station)}</p>
      <div className="modal-action">
        <form method="dialog">
          <button className="btn" onClick={handleClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  </dialog>
)

export default function Pins() {
  const { radioStations } = useAppContext()
  const [selectedStation, setSelectedStation] = React.useState<Station | null>(
    null,
  )
  // console.log('radioStations in Pins:', radioStations)

  return (
    <>
      {!!selectedStation && (
        <StationModel
          station={selectedStation}
          handleClose={() => setSelectedStation(null)}
        />
      )}
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
                    console.log({ e, radioStation })
                    // If we let the click event propagates to the map, it will immediately close the popup
                    // with `closeOnClick: true`
                    e.originalEvent.stopPropagation()
                    setSelectedStation(radioStation)
                  }}
                >
                  <Pin />
                </Marker>
              )
            }
          }),
        [radioStations],
      )}
    </>
  )
}

'use client'

import { simpleStationDiscription } from '@/utils/radioStations'
import { useAppContext } from '../context/AppContext'

const StationModel: React.FC = ({}) => {
  const { setSelectedStation, setIsPlaying, viewedStation, setViewedStation } =
    useAppContext()

  const handlePlay = () => {
    setIsPlaying(true) // otherwise the value can be incorrect when switch from one station to another
    setSelectedStation(viewedStation)
  }

  const handleClose = () => {
    setViewedStation(null)
  }

  if (!viewedStation) {
    return null
  }

  return (
    <dialog id="my_modal_5" className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{viewedStation.name}</h3>
        <p className="py-4">{simpleStationDiscription(viewedStation)}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleClose}>
              Close
            </button>
          </form>
          <button className="btn" onClick={handlePlay}>
            Play
          </button>
        </div>
      </div>
    </dialog>
  )
}
export default StationModel

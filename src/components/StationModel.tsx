'use client'

import { simpleStationDiscription } from '@/utils/radioStations'
import { useAppContext } from '../context/AppContext'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'

const StationModel: React.FC = ({}) => {
  const { viewedStation, setViewedStation } = useAppContext()

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
        <div className="flex items-center justify-between w-full">
          <LikeButton />
          <PlayButton station={viewedStation} />
          <button
            className="btn btn-square btn-ghost mt-1.5"
            onClick={handleClose}
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </dialog>
  )
}
export default StationModel

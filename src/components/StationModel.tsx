'use client'

import { locationString, simpleStationDiscription } from '@/utils/radioStations'
import { useAppContext } from '../context/AppContext'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import ExternalLink from './ExternalLink'

const StationModel: React.FC = ({}) => {
  const { viewedStation, setViewedStation, theme } = useAppContext()

  const handleClose = () => {
    setViewedStation(null)
  }

  if (!viewedStation) {
    return null
  }

  return (
    <dialog id="my_modal_5" className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">{viewedStation.name}</h3>
          <div onClick={handleClose} className="text-sm link">
            close
          </div>
        </div>
        <p className="pt-2 capitalize">
          {simpleStationDiscription(viewedStation)}
        </p>
        <p className="pt-2 pb-2 capitalize">{locationString(viewedStation)}</p>
        <ExternalLink
          href={viewedStation.homepage}
          rel={viewedStation.name}
          label="Station Homepage"
          theme={theme}
        />
        <ExternalLink
          href={viewedStation.urlResolved}
          rel={viewedStation.urlResolved}
          label="Station Stream Link"
          theme={theme}
        />

        <div className="divider"></div>

        <div className="flex items-center justify-between w-full pt-2.5">
          <LikeButton station={viewedStation} />
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

import { locationString, simpleStationDiscription } from '@/utils/radioStations'
import { Station } from 'radio-browser-api'
import * as React from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import ExternalLink from './ExternalLink'
import { Theme } from '@/context/AppContext.types'

interface UserInfoProps {
  station: Station
  theme: Theme
  handleClose?: () => void
}

const StationInfo: React.FC<UserInfoProps> = ({
  station,
  theme,
  handleClose,
}) => {
  return (
    <>
      <div className="flex justify-between">
        <h3 className="font-bold text-lg">{station.name}</h3>
        {!!handleClose && (
          <div onClick={handleClose} className="text-sm link">
            close
          </div>
        )}
      </div>
      <p className="pt-2 capitalize">{simpleStationDiscription(station)}</p>
      <p className="pt-2 pb-2 capitalize">{locationString(station)}</p>
      <ExternalLink
        href={station.homepage}
        rel={station.name}
        label="Station Homepage"
        theme={theme}
      />
      <ExternalLink
        href={station.urlResolved}
        rel={station.urlResolved}
        label="Station Stream Link"
        theme={theme}
      />

      <div className="divider"></div>

      <div className="flex items-center justify-between w-full pt-2.5">
        <LikeButton station={station} />
        <PlayButton station={station} />
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
    </>
  )
}

export default StationInfo

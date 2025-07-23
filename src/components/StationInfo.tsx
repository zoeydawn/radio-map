import { Station } from 'radio-browser-api'
import * as React from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import ExternalLink from './ExternalLink'
import { Theme } from '@/context/AppContext.types'
import ShareButton from './ShareButton'

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
        <h3 className="font-bold text-xl">{station.name}</h3>
        {!!handleClose && (
          <div onClick={handleClose} className="text-sm link">
            close
          </div>
        )}
      </div>
      <div className="divider"></div>

      <div className="capitalize">
        Language:{' '}
        {station.language.map((language) => (
          <div key={language} className="badge badge-secondary badge-sm ml-1">
            {language}
          </div>
        ))}
      </div>

      <div className="pt-3 capitalize">
        Tags:{' '}
        {station.tags.map((tag) => (
          <div key={tag} className="badge badge-info badge-sm ml-1">
            {tag}
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-4'>
        <ExternalLink
          href={station.homepage}
          rel={station.name}
          label="Homepage"
          theme={theme}
        />

        <ShareButton station={station} theme={theme} />
      </div>

      <div className="divider"></div>

      <div className="flex items-center justify-between w-full pt-2.5">
        <LikeButton station={station} />
        <PlayButton station={station} />
        {!!handleClose && (
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
        )}
      </div>
    </>
  )
}

export default StationInfo

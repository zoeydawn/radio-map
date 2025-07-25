import { Station } from 'radio-browser-api'
import * as React from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import ExternalLink from './ExternalLink'
import { Theme } from '@/context/AppContext.types'
import ShareButton from './ShareButton'
import Image from 'next/image'
import { getImageUrlForStation } from '@/utils/radioStations'
import {
  FlagIconMini,
  LanguageIcon,
  TagIconMini,
} from './Icons'

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
  const { language, tags, homepage, name, country } = station

  // because there is an empty string in the language array when there is no language
  const languageArrayIsEmpty = !(language.length && language[0] !== '')
  const imageUrl = getImageUrlForStation(station)

  return (
    <>
      <div className="flex justify-between">
        <div className="relative h-28 w-4/5">
          <Image
            className="size-28"
            alt={station.name}
            src={imageUrl}
            fill // Makes the image fill the parent div
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            sizes="(max-width: 400px) 100vw, 400px"
            placeholder="blur"
            blurDataURL={'/favicon.ico'}
          />
        </div>
        {!!handleClose && (
          <div onClick={handleClose} className="text-sm link">
            close
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg pt-2">{name}</h3>
      <div className="divider"></div>
      {!!country && (
        <div className="capitalize pb-3 flex">
          <FlagIconMini />{' '}
          Location: <div className="badge badge-primary ml-1">{country}</div>
        </div>
      )}

      {!languageArrayIsEmpty && (
        <div className="capitalize flex">
          <LanguageIcon />{' '}
          Language:{' '}
          {language.map((language) =>
            language ? (
              <div key={language} className="badge badge-secondary ml-1">
                {language}
              </div>
            ) : null,
          )}
        </div>
      )}

      {!!tags.length && (
        <div className="pt-3 flex">
          <TagIconMini />{' '}
          Tags:{' '}
          {tags.map((tag) => (
            <div key={tag} className="badge badge-info badge-sm ml-1 uppercase">
              {tag}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <ExternalLink
          href={homepage}
          rel={name}
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

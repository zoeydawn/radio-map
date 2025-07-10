import { simpleStationDiscription } from '@/utils/radioStations'
import Image from 'next/image'
import { Station } from 'radio-browser-api'
import * as React from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'

interface UserInfoProps {
  stations: Station[]
  header?: string
}

const StationList: React.FC<UserInfoProps> = ({ stations, header }) => {
  return (
    <ul className="list bg-base-100 rounded-box shadow-md max-w-150 m-auto mt-4">
      {!!header && (
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{header}</li>
      )}

      {stations.map((station) => {
        const { id, name, favicon } = station
        const proxiedSrc = favicon
          ? `/api/image-proxy?url=${encodeURIComponent(favicon)}`
          : '/favicon.ico'

        return (
          <li className="list-row" key={`station-${id}`}>
            <div>
              <Image
                className="size-10 rounded-box"
                alt={name}
                src={proxiedSrc}
                height={40}
                width={40}
                placeholder="blur"
                blurDataURL={'/favicon.ico'}
              />
            </div>
            <div>
              <div>{name}</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {simpleStationDiscription(station)}
              </div>
            </div>

            <LikeButton />

            <PlayButton station={station} />
          </li>
        )
      })}
    </ul>
  )
}

export default StationList

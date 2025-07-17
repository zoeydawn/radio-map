import { simpleStationDiscription } from '@/utils/radioStations'
import Image from 'next/image'
import { Station } from 'radio-browser-api'
import * as React from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import Loader from './Loader'

interface UserInfoProps {
  stations: Station[]
  setViewedStation: (station: Station) => void
  header?: string
  isLoading?: boolean
  onLoadMore?: () => void
}

const StationList: React.FC<UserInfoProps> = ({
  stations,
  header,
  setViewedStation,
  isLoading,
  onLoadMore,
}) => {
  return (
    <div className="pb-50">
      <ul className="list bg-base-100 rounded-box shadow-md max-w-150 m-auto mt-4">
        {!!header && (
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            {header}
          </li>
        )}

        {stations.map((station) => {
          const { id, name, favicon } = station
          const proxiedSrc = favicon
            ? `/api/image-proxy?url=${encodeURIComponent(favicon)}`
            : '/favicon.ico'

          return (
            <li className="list-row" key={`station-${id}`}>
              <div
                className="cursor-pointer"
                onClick={() => setViewedStation(station)}
              >
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
              <div
                className="cursor-pointer"
                onClick={() => setViewedStation(station)}
              >
                <div>{name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {simpleStationDiscription(station)}
                </div>
              </div>

              <LikeButton station={station} />

              <PlayButton station={station} />
            </li>
          )
        })}
        <li>{isLoading && <Loader />}</li>
        {!isLoading && !!onLoadMore && (
          <li className="flex flex-col items-center pt-2.5 pb-2.5">
            <button onClick={onLoadMore} className="btn btn-soft btn-primary">
              Load more
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default StationList

import { simpleStationDiscription } from '@/utils/radioStations'
import Image from 'next/image'
import { Station } from 'radio-browser-api'
import * as React from 'react'

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
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default StationList

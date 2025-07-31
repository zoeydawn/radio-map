import { getImageUrlForStation } from '@/utils/radioStations'
import Image from 'next/image'
import { Station } from 'radio-browser-api'
import React from 'react'

interface StationImageProps {
  station: Station
}

const StationImage: React.FC<StationImageProps> = ({ station }) => {
  const imageUrl = getImageUrlForStation(station)
  return (
    <Image
      className="size-10 rounded-box"
      alt={station.name}
      src={imageUrl}
      height={40}
      width={40}
      placeholder="blur"
      blurDataURL={'/favicon.ico'}
      unoptimized
    />
  )
}

export default StationImage

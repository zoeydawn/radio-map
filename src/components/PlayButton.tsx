'use client' // required for any component file that consumes the context.

import React from 'react'

import { useAppContext } from '../context/AppContext'
import { Station } from 'radio-browser-api'

interface PlayButtonProps {
  station: Station
}

const PlayButton: React.FC<PlayButtonProps> = ({ station }) => {
  const { isPlaying, setIsPlaying, selectedStation, setSelectedStation } =
    useAppContext()

  const isCurrentStationSelected =
    selectedStation && station.id === selectedStation.id
  const isCurrentStationPlaying = isCurrentStationSelected && isPlaying

  const togglePlayPause = () => {
    if (isCurrentStationSelected) {
      setIsPlaying(!isPlaying)
    } else {
      setSelectedStation(station)
      setIsPlaying(true)
    }
  }

  return (
    <button
      className="btn btn-square btn-ghost"
      onClick={togglePlayPause}
      aria-label={isCurrentStationPlaying ? 'Pause' : 'Play'}
    >
      {isCurrentStationPlaying ? (
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
            d="M15.75 5.25v13.5m-7.5-13.5v13.5"
          />
        </svg>
      ) : (
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
      )}
    </button>
  )
}

export default PlayButton

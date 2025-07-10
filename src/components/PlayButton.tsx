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
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
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

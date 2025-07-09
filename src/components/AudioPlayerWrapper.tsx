'use client' // required for any component file that consumes the context.

import React from 'react'

import { useAppContext } from '../context/AppContext'
import AudioPlayer from './AudioPlayer'

const AudioPlayerWrapper: React.FC = () => {
  const { selectedStation, setSelectedStation } = useAppContext()
  // console.log('selectedStation in AudioPlayerWrapper:', selectedStation)

  return (
    <>
      {selectedStation && (
        <AudioPlayer
          station={selectedStation}
          handleClose={() => setSelectedStation(null)}
        />
      )}
    </>
  )
}

export default AudioPlayerWrapper

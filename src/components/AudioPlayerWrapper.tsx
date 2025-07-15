'use client' // required for any component file that consumes the context.

import React from 'react'

// import { useAppContext } from '../context/AppContext'
import AudioPlayer from './AudioPlayer'

const AudioPlayerWrapper: React.FC = () => {
  // const {
  //   selectedStation,
  //   setSelectedStation,
  //   isPlaying,
  //   setIsPlaying,
  //   setViewedStation,
  //   playError,
  //   setPlayError,
  // } = useAppContext()
  // console.log('selectedStation in AudioPlayerWrapper:', selectedStation)

  return (
    <AudioPlayer
    // selectedStation={selectedStation}
    // handleClose={() => setSelectedStation(null)}
    // isPlaying={isPlaying}
    // setIsPlaying={setIsPlaying}
    // setViewedStation={setViewedStation}
    // playError={playError}
    // setPlayError={setPlayError}
    />
  )
}

export default AudioPlayerWrapper

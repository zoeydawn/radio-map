'use client' // required for any component file that consumes the context.

import React, { useRef, useEffect, useState } from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import Hls from 'hls.js'
import { useAppContext } from '@/context/AppContext'

const AudioPlayer: React.FC = () => {
  const {
    selectedStation,
    isPlaying,
    setIsPlaying,
    setViewedStation,
    playError,
    setPlayError,
  } = useAppContext()
  const audioRef = useRef<HTMLAudioElement>(null)
  const hlsInstanceRef = useRef<Hls | null>(null) // To store the hls.js instance
  const [currentTime, setCurrentTime] = useState(0)

  const urlResolved = selectedStation?.urlResolved

  // Effect to handle initial loading and play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.pause()
      } else {
        // it's better to reset all of this when playing a stream that has been paused,
        // otherwise it tries to continue from where you left off which can break the stream if it's been paused for a long time
        const audio = audioRef.current
        // Event listeners for updating state
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)

        // Check if the URL is an HLS (.m3u8) stream
        if (urlResolved?.endsWith('.m3u8')) {
          // console.log('playing a .m3u8 stream!')
          if (Hls.isSupported()) {
            const hls = new Hls()
            hlsInstanceRef.current = hls // Store the instance
            hls.loadSource(urlResolved)
            hls.attachMedia(audio)

            hls.on(Hls.Events.ERROR, function (event, data) {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error(
                      'fatal network error encountered, try to recover',
                      data,
                    )
                    hls.startLoad()
                    break
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error(
                      'fatal media error encountered, try to recover',
                      data,
                    )
                    hls.recoverMediaError()
                    break
                  default:
                    // cannot recover
                    console.error('fatal error, destroying HLS instance', data)
                    hls.destroy()
                    hlsInstanceRef.current = null // Clear reference
                    break
                }
                setPlayError('HLS error')
              }
            })
          } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            // Fallback for browsers that natively support HLS (e.g., Safari)
            audio.src = urlResolved
          } else {
            console.error(
              'HLS is not supported in this browser, and native HLS playback is not available.',
            )
            setPlayError('HLS not supported in browser')
          }
        } else {
          // For non-.m3u8 URLs, just set the src attribute directly
          audio.src = urlResolved || ''
        }

        // Play when switching directly from one station to another
        audioRef.current.play().catch((error) => {
          console.error('Autoplay failed:', error)

          setPlayError(error)
          setIsPlaying(false)
        })

        // Cleanup event listeners on component unmount
        return () => {
          audio.removeEventListener('timeupdate', handleTimeUpdate)
          audio.removeEventListener('ended', handleEnded)

          // Cleanup HLS
          if (hlsInstanceRef.current) {
            hlsInstanceRef.current.destroy()
            hlsInstanceRef.current = null
          }
          audio.src = '' // Ensure source is cleared
        }
      }
    }
  }, [isPlaying, selectedStation, urlResolved, setIsPlaying, setPlayError]) // Re-run if station prop changes

  // Helper to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  if (!selectedStation) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-col items-center">
      <div className="rounded-lg bg-base-300 w-full max-w-170">
        <div className="flex flex-col items-center space-y-4 p-3">
          <audio ref={audioRef} preload="metadata" className="hidden" />
          <h3
            onClick={() => setViewedStation(selectedStation)}
            className="font-bold text-lg link link-hover"
          >
            {selectedStation.name}
          </h3>

          {!!playError && (
            <div className="text-error text-center">
              Sorry, we are unable to stream that station right now.
            </div>
          )}

          <div className="flex items-center justify-between w-full">
            <LikeButton station={selectedStation} />

            {/* play/pause button */}
            <PlayButton station={selectedStation} />

            <div className="text-gray-700 text-sm font-mono">
              {formatTime(currentTime)}{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer

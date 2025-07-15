import { Station } from 'radio-browser-api'
import React, { useRef, useEffect, useState } from 'react'
import PlayButton from './PlayButton'
import LikeButton from './LikeButton'
import Hls from 'hls.js'

// Define the props for the AudioPlayer component
interface AudioPlayerProps {
  station: Station | null
  handleClose: () => void
  isPlaying: boolean
  playError: string
  setIsPlaying: (value: boolean) => void
  setViewedStation: (station: Station | null) => void
  setPlayError: (error: string) => void
  // autoPlay?: boolean // Whether the audio should autoplay (defaults to true)
  // loop?: boolean // Whether the audio should loop (defaults to false)
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  station,
  isPlaying,
  setIsPlaying,
  setViewedStation,
  playError,
  setPlayError,
  // autoPlay = true,
  // loop = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const hlsInstanceRef = useRef<Hls | null>(null) // To store the hls.js instance
  const [currentTime, setCurrentTime] = useState(0)

  // const { urlResolved } = station
  const urlResolved = station?.urlResolved

  // Effect to handle autoplay and initial loading
  useEffect(() => {
    if (audioRef.current) {
      // Event listeners for updating state
      const audio = audioRef.current
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
      const handleEnded = () => setIsPlaying(false)

      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)

      // Check if the URL is an HLS (.m3u8) stream
      if (urlResolved?.endsWith('.m3u8')) {
        console.log('playing a .m3u8 stream!')
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
  }, [station, urlResolved, setIsPlaying, setPlayError]) // Re-run if station prop changes

  // so autoRef will respond to isPlaying
  useEffect(() => {
    // console.log('in useEffect (line 128)')
    // console.log('isPlaying:', isPlaying)
    if (audioRef.current) {
      // console.log('audioRef.current.src:', audioRef.current.src)
      if (!isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Play failed:', error)

          setPlayError(error) // Handle cases where play might be blocked (e.g., by browser policies)
          setIsPlaying(false)
        })
      }
    }
  }, [isPlaying, setPlayError, setIsPlaying])

  // Helper to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  if (!station) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral">
      <div className="flex flex-col items-center space-y-4 p-3">
        <audio
          ref={audioRef}
          // src={urlResolved}
          // loop={loop}
          // autoPlay={true}
          preload="metadata"
          className="hidden"
        />
        <h3
          onClick={() => setViewedStation(station)}
          className="font-bold text-lg link link-hover"
        >
          {station.name}
        </h3>

        {!!playError && (
          <div className="text-error text-center">
            Sorry, we are unable to stream that station right now.
          </div>
        )}

        <div className="flex items-center justify-between w-full max-w-150">
          <LikeButton station={station} />

          {/* play/pause button */}
          <PlayButton station={station} />

          <div className="text-gray-700 text-sm font-mono">
            {formatTime(currentTime)}{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer

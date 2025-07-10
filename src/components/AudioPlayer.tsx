import { Station } from 'radio-browser-api'
import React, { useRef, useEffect, useState } from 'react'
import PlayButton from './PlayButton'

// Define the props for the AudioPlayer component
interface AudioPlayerProps {
  station: Station // The URL of the MP3 file
  handleClose: () => void
  isPlaying: boolean
  setIsPlaying: (value: boolean) => void
  autoPlay?: boolean // Whether the audio should autoplay (defaults to true)
  loop?: boolean // Whether the audio should loop (defaults to false)
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  station,
  isPlaying,
  setIsPlaying,
  autoPlay = true,
  loop = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const { urlResolved } = station

  // Effect to handle autoplay and initial loading
  useEffect(() => {
    if (audioRef.current) {
      if (autoPlay) {
        audioRef.current.play().catch((error) => {
          console.error('Autoplay failed:', error)
          // TODO: Inform the user that autoplay might be blocked
          // display an error message in the player view
        })
      }

      // Event listeners for updating state
      const audio = audioRef.current
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
      const handleEnded = () => setIsPlaying(false)

      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)

      // Cleanup event listeners on component unmount
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [autoPlay, station.id, setIsPlaying]) // Re-run if either autoPlay or station prop changes

  // so autoRef will respond to isPlaying
  useEffect(() => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Play failed:', error)
          // TODO: Handle cases where play might be blocked (e.g., by browser policies)
        })
      }
    }
  }, [isPlaying])

  // Helper to format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral">
      <div className="flex flex-col items-center space-y-4 p-3">
        <audio
          ref={audioRef}
          src={urlResolved}
          loop={loop}
          preload="metadata"
          className="hidden"
        />
        <h3 className="font-bold text-lg">{station.name}</h3>

        <div className="flex items-center justify-between w-full max-w-150">
          {/* like button  */}
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

          {/* play/pause button */}
          <PlayButton />

          <div className="text-gray-700 text-sm font-mono">
            {formatTime(currentTime)}{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer

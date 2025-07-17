'use client'
import { useAppContext } from '@/context/AppContext'
import { Station } from 'radio-browser-api'
import { HeartIcon } from './Icons'

interface LikeButtonProps {
  station: Station
}

const LikeButton: React.FC<LikeButtonProps> = ({ station }) => {
  const { favoritesIdsSet, addFavorite, removeFavorite } = useAppContext()
  const isAlreadyInFavorites = favoritesIdsSet.has(station.id)

  const handleClick = () => {
    if (isAlreadyInFavorites) {
      removeFavorite(station)
    } else {
      addFavorite(station)
    }
  }

  return (
    <button onClick={handleClick} className="btn btn-square btn-ghost">
      <HeartIcon fill={isAlreadyInFavorites ? 'currentColor' : 'none'} />
    </button>
  )
}

export default LikeButton

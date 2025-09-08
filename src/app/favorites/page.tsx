'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'

export default function Favorites() {
  const { favorites, setViewedStation } = useAppContext()

  if (!favorites.length) {
    return (
      <div className="flex flex-col items-center space-y-4 p-3">
        <h3 className="font-bold text-lg">There is nothing in Favorites</h3>
      </div>
    )
  }
  return (
    <>
      <StationList
        stations={favorites}
        setViewedStation={setViewedStation}
        header="Your Favorites"
        showSearch
      />
    </>
  )
}

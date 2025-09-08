'use client'

import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'

export default function History() {
  const { history, setViewedStation } = useAppContext()

  if (!history.length) {
    return (
      <div className="flex flex-col items-center space-y-4 p-3">
        <h3 className="font-bold text-lg">No history yet</h3>
      </div>
    )
  }

  return (
    <>
      <StationList
        stations={history}
        setViewedStation={setViewedStation}
        header="Your Favorites"
        showSearch
      />
    </>
  )
}

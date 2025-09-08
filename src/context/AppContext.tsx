'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { AppContextProps, Theme } from './AppContext.types'
import { Station } from 'radio-browser-api'
import { removeDuplicatesById } from '@/utils/radioStations'

// Create the context with a default value (can be undefined or a mock, but we'll handle it in the provider)
// We assert the type here, knowing the Provider will supply the actual value.
const AppContext = createContext<AppContextProps | undefined>(undefined)

// Export the Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light') // light theme by default
  const [selectedStation, setSelectedStation] = useState<Station | null>(null) // station to be played
  const [viewedStation, setViewedStation] = useState<Station | null>(null) // station to view details of
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playError, setPlayError] = useState('')
  const [favorites, setFavorites] = useState<Station[]>([])
  const [history, setHistory] = useState<Station[]>([])

  // save to local storage
  const saveToLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error(`Error saving ${key} to local storage:`, error)
    }
  }

  // save theme to local storage and update state
  const setAndSaveTheme = (theme: Theme) => {
    setTheme(theme)
    saveToLocalStorage('theme', theme)
  }

  // read theme to local storage and update state
  const readAndSaveTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme')

      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.error('Error reading theme from local storage:', error)
    }
  }

  // save favorites to state and local storage
  const saveFavorites = (newFavorites: Station[]) => {
    setFavorites(newFavorites)

    saveToLocalStorage('favorites', JSON.stringify(newFavorites))
  }

  // add station to favorites
  const addFavorite = (station: Station) => {
    const updatedFavorites = [...favorites, station]

    saveFavorites(updatedFavorites)
  }

  // add station to history
  const addToHistory = (station: Station | null) => {
    if (!!station) {
      const updatedHistory = removeDuplicatesById([station, ...history])

      setHistory(updatedHistory)
      saveToLocalStorage('history', JSON.stringify(updatedHistory))
    }
  }

  // remove station from favorites
  const removeFavorite = (stationToRemove: Station) => {
    const updatedFavorites = favorites.filter(
      (station) => station.id !== stationToRemove.id,
    )

    saveFavorites(updatedFavorites)
  }

  // read favorites from local storage and update state
  const readAndSaveFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('favorites')

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error('Error reading favorites from local storage:', error)
    }
  }

  // read history from local storage and update state
  const readAndSaveHistory = () => {
    try {
      const savedHistory = localStorage.getItem('history')

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error('Error reading history from local storage:', error)
    }
  }

  const setAndRecordStation = (station: Station | null) => {
    setSelectedStation(station)
    addToHistory(station)
  }

  // Fetch data when the provider mounts
  useEffect(() => {
    // read from local storage and update state accordingly
    readAndSaveTheme()
    readAndSaveFavorites()
    readAndSaveHistory()
  }, []) // Empty dependency array means this runs once on mount

  // a set containing the ids of the stations in favorites
  // this is so we can efficently look up whether a station is already in favorites
  const favoritesIdsSet = new Set(favorites.map((station) => station.id))

  return (
    <AppContext.Provider
      value={{
        theme,
        selectedStation,
        viewedStation,
        isPlaying,
        playError,
        favorites,
        favoritesIdsSet,
        history,
        setTheme: setAndSaveTheme,
        setSelectedStation: setAndRecordStation,
        setViewedStation,
        setIsPlaying,
        setPlayError,
        addFavorite,
        removeFavorite,
      }}
    >
      <div className="h-full bg-base-200" data-theme={theme}>
        {children}
      </div>
    </AppContext.Provider>
  )
}

// Export a custom hook to use the context
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

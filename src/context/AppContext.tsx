'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import {
  AppContextProps,
  Theme,
} from './AppContext.types'
import { Station } from 'radio-browser-api'

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
  const [favorites, setFavorites] = useState<Station[]>([]) // stations by geographic possition

  // save theme to local storage and update state
  const setAndSaveTheme = (theme: Theme) => {
    setTheme(theme)

    try {
      // save theme to local storage
      localStorage.setItem('theme', theme)
      // console.log('Theme saved successfully!')
    } catch (error) {
      console.error('Error saving theme to local storage:', error)
    }
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
    // save to state
    setFavorites(newFavorites)

    // save local storage
    try {
      const stringifiedFavorites = JSON.stringify(newFavorites)
      localStorage.setItem('favorites', stringifiedFavorites)
    } catch (error) {
      console.error('Error saving favorites to local storage:', error)
    }
  }

  // add station to favorites
  const addFavorite = (station: Station) => {
    const updatedFavorites = [...favorites, station]

    saveFavorites(updatedFavorites)
  }

  // remove station from favorites
  const removeFavorite = (stationToRemove: Station) => {
    const updatedFavorites = favorites.filter(
      (station) => station.id !== stationToRemove.id,
    )

    saveFavorites(updatedFavorites)
  }

  // read theme to local storage and update state
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

  // Fetch data when the provider mounts
  useEffect(() => {
    // read from local storage and update state accordingly
    readAndSaveTheme()
    readAndSaveFavorites()
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
        setTheme: setAndSaveTheme,
        setSelectedStation,
        setViewedStation,
        setIsPlaying,
        setPlayError,
        addFavorite,
        removeFavorite,
      }}
    >
      <div data-theme={theme}>{children}</div>
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

'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { AppContextProps, Theme } from './AppContext.types'
import { ViewState } from 'react-map-gl/mapbox'
import { stationsByGeographicArea } from '@/services/radioBrowserService'
import { Station } from 'radio-browser-api'
import { removeDuplicatesById } from '@/utils/radioStations'

const initialViewState: ViewState = {
  longitude: -73.7,
  latitude: 45.5,
  zoom: 8.5,
  bearing: 0,
  pitch: 0,
  padding: {},
}

// Create the context with a default value (can be undefined or a mock, but we'll handle it in the provider)
// We assert the type here, knowing the Provider will supply the actual value.
const AppContext = createContext<AppContextProps | undefined>(undefined)

// Export the Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('dark')
  const [isLoading, setIsLoading] = useState<boolean>(true) // when initially fetching stations by geographic possition
  const [radioStations, setRadioStations] = useState<Station[]>([]) // stations by geographic possition
  const [viewState, setViewState] = useState<ViewState>(initialViewState) // view state for the map
  const [selectedStation, setSelectedStation] = useState<Station | null>(null) // station to be played
  const [viewedStation, setViewedStation] = useState<Station | null>(null) // station to view details of
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
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

  // add station to favorites and update localstorage
  const addFavorite = (station: Station) => {
    const updatedFavorites = [...favorites, station]
    setFavorites(updatedFavorites)

    // save local storage
    try {
      const stringifiedFavorites = JSON.stringify(updatedFavorites)
      localStorage.setItem('favorites', stringifiedFavorites)
      // console.log('Theme saved successfully!')
    } catch (error) {
      console.error('Error saving favorites to local storage:', error)
    }
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

  // add new stations to the state without removing old ones
  // because we want new new stations to appear while moving the map, without deleting the old ones.
  const addNewRadioStations = (newStations: Station[]) => {
    const combinedStationArray = [...radioStations, ...newStations]
    const newStationArray = removeDuplicatesById(combinedStationArray)

    setRadioStations(newStationArray)
  }

  // TODO: Prevent redundant fetching - don't fetch new stations if the lat and lon hasn't changed much.
  const getStationsByLatAndLong = async (lat: number, lon: number) => {
    // TODO: add error logic
    setIsLoading(true)
    // setError(null);
    try {
      const data = await stationsByGeographicArea(lat, lon)

      addNewRadioStations(data)
    } catch (error) {
      // TODO: error handling logic
      // setError(err.message || 'Failed to fetch stations');
      console.error('error in getStations:', error)
      // setStations([]); // Clear stations on error or keep stale data based on preference
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when the provider mounts
  useEffect(() => {
    // read theme from local storage and update state accordingly
    readAndSaveTheme()
    readAndSaveFavorites()

    getStationsByLatAndLong(viewState.latitude, viewState.longitude)
  }, []) // Empty dependency array means this runs once on mount

  // a set containing the ids of the stations in favorites
  // this is so we can efficently look up whether a station is already in favorites
  const favoritesIdsSet = new Set(favorites.map((station) => station.id))

  return (
    <AppContext.Provider
      value={{
        theme,
        isLoading,
        radioStations,
        viewState,
        selectedStation,
        viewedStation,
        isPlaying,
        playError,
        favorites,
        favoritesIdsSet,
        setTheme: setAndSaveTheme,
        setIsLoading,
        setRadioStations,
        setViewState,
        getStationsByLatAndLong,
        setSelectedStation,
        setViewedStation,
        setIsPlaying,
        setPlayError,
        addFavorite,
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

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
  Possition,
  Theme,
  UserLocationType,
} from './AppContext.types'
import { ViewState } from 'react-map-gl/mapbox'
import { stationsByGeographicArea } from '@/services/radioBrowserService'
import { Station } from 'radio-browser-api'
import { removeDuplicatesById } from '@/utils/radioStations'
import { fetchEstimatedUserLocation } from '@/services/ipifyService'
import { areLocationsWithin50Km } from '@/utils/map'

const initialViewState: ViewState = {
  longitude: -73.7, // default to Montreal
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
  const [previousPossition, setPreviousPossition] = useState<Possition>({
    lat: 0,
    lon: 0,
  }) // keep track of the last possition from where we fetched station so that we can compare it against the current possition
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

  // save favorites to state and local storage
  const saveFavorites = (newFavorites: Station[]) => {
    // save to state
    setFavorites(newFavorites)

    // save local storage
    try {
      const stringifiedFavorites = JSON.stringify(newFavorites)
      localStorage.setItem('favorites', stringifiedFavorites)
      // console.log('Theme saved successfully!')
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

  // add new stations to the state without removing old ones
  // because we want new new stations to appear while moving the map, without deleting the old ones.
  const addNewRadioStations = (newStations: Station[]) => {
    const combinedStationArray = [...radioStations, ...newStations]
    const newStationArray = removeDuplicatesById(combinedStationArray)

    setRadioStations(newStationArray)
  }

  const getStationsByLatAndLong = async (lat: number, lon: number) => {
    // TODO: add error logic

    try {
      // make sure map has moved significatly before fetching
      if (
        areLocationsWithin50Km(
          lat,
          lon,
          previousPossition.lat,
          previousPossition.lon,
        )
      ) {
        console.log('not fetching more stations, map hasnt moved enough')
      } else {
        const data = await stationsByGeographicArea(lat, lon)

        addNewRadioStations(data)
        setPreviousPossition({ lat, lon })
      }
    } catch (error) {
      // TODO: error handling logic
      // setError(err.message || 'Failed to fetch stations');
      console.error('error in getStations:', error)
      // setStations([]); // Clear stations on error or keep stale data based on preference
    } finally {
      setIsLoading(false)
    }
  }

  // for when we can't estimate the location, we show the default
  const getStationsByDefaultView = () => {
    getStationsByLatAndLong(viewState.latitude, viewState.longitude)
  }

  // fetch the estimated user location so that we can show their city on the map
  const getEstimatedLatAndLon = async () => {
    try {
      const userLocation: UserLocationType = await fetchEstimatedUserLocation()
      console.info('userLocation:', userLocation)
      if (!userLocation) {
        return
      }

      const longitude = userLocation.location.lng
      const latitude = userLocation.location.lat

      return { longitude, latitude }
    } catch (error) {
      console.error('error getting userLocation ip address:', error)
    }
  }

  // actions that have to be run asyncrounosly on mount
  const initialAsyncFunctions = async () => {
    setIsLoading(true)
    const clientLocation = await getEstimatedLatAndLon()

    if (
      !clientLocation ||
      (!clientLocation.latitude && !clientLocation.longitude)
    ) {
      getStationsByDefaultView() // use the default location if we can't estimate the user's location
    } else {
      const { longitude, latitude } = clientLocation

      await getStationsByLatAndLong(latitude, longitude)

      setViewState({
        longitude,
        latitude,
        zoom: 8.5,
        bearing: 0,
        pitch: 0,
        padding: {},
      })
    }

    setIsLoading(false)
  }

  // Fetch data when the provider mounts
  useEffect(() => {
    // read from local storage and update state accordingly
    readAndSaveTheme()
    readAndSaveFavorites()

    initialAsyncFunctions()
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
        previousPossition,
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

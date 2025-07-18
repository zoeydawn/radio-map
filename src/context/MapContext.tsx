'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import {
  MapContextProps,
  Possition,
  UserLocationType,
} from './MapContext.types'
import { ViewState } from 'react-map-gl/mapbox'
import { stationsByGeographicArea } from '@/services/radioBrowserService'
import { Station } from 'radio-browser-api'
import { removeDuplicatesById } from '@/utils/radioStations'
import { fetchEstimatedUserLocation } from '@/services/ipifyService'
import { areLocationsWithin50Km } from '@/utils/map'

const defaultViewState: ViewState = {
  longitude: -73.7, // default to Montreal
  latitude: 45.5,
  zoom: 8.5,
  bearing: 0,
  pitch: 0,
  padding: {},
}

// Create the context with a default value (can be undefined or a mock, but we'll handle it in the provider)
// We assert the type here, knowing the Provider will supply the actual value.
const MapContext = createContext<MapContextProps | undefined>(undefined)

// Export the Provider component
export const MapViewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true) // when initially fetching stations by geographic possition
  const [radioStations, setRadioStations] = useState<Station[]>([]) // stations by geographic possition
  const [viewState, setViewState] = useState<ViewState>(defaultViewState) // view state for the map
  const [previousPossition, setPreviousPossition] = useState<Possition>({
    lat: 0,
    lon: 0,
  }) // keep track of the last possition from where we fetched station so that we can compare it against the current possition

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
  }

  // Fetch data when the provider mounts
  useEffect(() => {
    initialAsyncFunctions()
  }, []) // Empty dependency array means this runs once on mount

  return (
    <MapContext.Provider
      value={{
        isLoading,
        radioStations,
        viewState,
        previousPossition,
        setIsLoading,
        setRadioStations,
        setViewState, // do we still need this?
        getStationsByLatAndLong,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

// Export a custom hook to use the context
export const useMapContext = (): MapContextProps => {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapViewProvider')
  }
  return context
}

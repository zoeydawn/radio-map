'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { MapContextProps, UserLocationType } from './MapContext.types'
import { ViewState } from 'react-map-gl/mapbox'
import { Station } from 'radio-browser-api'
import { removeDuplicatesById } from '@/utils/radioStations'
import { fetchEstimatedUserLocation } from '@/services/ipifyService'
import { fetchByGeoLocation } from '@/services/apiService'

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
  const [fetchedAreas, setFetchedGeoLocations] = useState<string[]>([]) // keep track of which geo-locations we have already fetched data for

  // add new stations to the state without removing old ones
  // because we want new new stations to appear while moving the map, without deleting the old ones.
  const addNewRadioStations = (newStations: Station[]) => {
    const combinedStationArray = [...radioStations, ...newStations]
    const newStationArray = removeDuplicatesById(combinedStationArray)

    setRadioStations(newStationArray)
  }

  const getStationsByLatAndLong = async (lat: number, lon: number) => {
    // round the lat and lon so as not to have fewer unique queries and therefore better caching
    const roundedLat = Math.round(lat)
    const roundedLon = Math.round(lon)
    const geoString = `${roundedLat}-${roundedLon}`

    try {
      // make sure we haven't already fetch stations for this geo-location
      if (fetchedAreas.includes(geoString)) {
        console.log('not fetching more stations, already fetched this area')
      } else {
        const data = await fetchByGeoLocation({
          geo_lat: roundedLat,
          geo_long: roundedLon,
        })

        addNewRadioStations(data.data)
        setFetchedGeoLocations([...fetchedAreas, geoString])
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
        // previousPossition,
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

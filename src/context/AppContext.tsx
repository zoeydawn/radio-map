'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { AppContextProps, Theme } from './AppContext.types'
import { ViewState } from 'react-map-gl/mapbox'
import { stationsByGeographicArea } from '@/services/radioBrowserService'
import { Station } from 'radio-browser-api'

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
  const [theme, setTheme] = useState<Theme>('light')
  const [radioStations, setRadioStations] = useState<Station[]>([])
  const [viewState, setViewState] = useState<ViewState>(initialViewState)

  const getStationsByLatAndLong = useCallback(async () => {
    // TODO: add "loading" logic
    // setIsLoading(true);
    // setError(null);
    try {
      const data = await stationsByGeographicArea(
        viewState.latitude,
        viewState.longitude,
      )
      setRadioStations(data)
    } catch (error) {
      // TODO: error handling logic
      // setError(err.message || 'Failed to fetch stations');
      console.error('error in getStations:', error)
      // setStations([]); // Clear stations on error or keep stale data based on preference
    } finally {
      // setIsLoading(false);
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        theme,
        radioStations,
        viewState,
        setTheme,
        setRadioStations,
        setViewState,
        getStationsByLatAndLong: getStationsByLatAndLong,
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

'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AppState, AppContextProps, RadioStation } from './AppContext.types'
import { ViewState } from 'react-map-gl/mapbox'

// Define the initial state
const initialState: AppState = {
  theme: 'light', // Default theme
  radioStations: [], // Default empty array for radio stations
  viewState: {
    longitude: -73.7,
    latitude: 45.5,
    zoom: 8.5,
    bearing: 0,
    pitch: 0,
    padding: {},
  },
}

// Create the context with a default value (can be undefined or a mock, but we'll handle it in the provider)
// We assert the type here, knowing the Provider will supply the actual value.
const AppContext = createContext<AppContextProps | undefined>(undefined)

// Export the Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>(initialState)

  const setTheme = (theme: 'light' | 'dark') => {
    setState((prevState) => ({ ...prevState, theme }))
  }

  const setRadioStations = (stations: RadioStation[]) => {
    setState((prevState) => ({ ...prevState, radioStations: stations }))
  }

  const setViewState = (viewState: ViewState) => {
    // console.log({ viewState })
    setState((prevState) => ({ ...prevState, viewState }))
  }

  // You can add more complex logic here for updating stations if needed

  return (
    <AppContext.Provider
      value={{ state, setTheme, setRadioStations, setViewState }}
    >
      <div data-theme={state.theme}>{children}</div>
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

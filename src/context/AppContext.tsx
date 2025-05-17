'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AppContextProps, RadioStation, Theme } from './AppContext.types'
import { ViewState } from 'react-map-gl/mapbox'

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
  const [radioStations, setRadioStations] = useState<RadioStation[]>([])
  const [viewState, setViewState] = useState<ViewState>(initialViewState)

  return (
    <AppContext.Provider
      value={{
        theme,
        radioStations,
        viewState,
        setTheme,
        setRadioStations,
        setViewState,
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

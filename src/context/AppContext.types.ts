import { ViewState } from 'react-map-gl/mapbox'

// Define the structure for a single radio station
export interface RadioStation {
  id: string // Or number, depending on your data
  name: string
  url: string
  // Add any other properties a radio station might have
  genre?: string
  bitrate?: number
}

// Define the shape of your context state
export interface AppState {
  theme: 'light' | 'dark'
  radioStations: RadioStation[]
  viewState: ViewState
}

// Define the shape of your context, including state and updater functions
export interface AppContextProps {
  state: AppState
  setTheme: (theme: 'light' | 'dark') => void
  setRadioStations: (stations: RadioStation[]) => void
  setViewState: (viewState: ViewState) => void
  // You could add more specific updaters if needed, e.g., addRadioStation, removeRadioStation
}

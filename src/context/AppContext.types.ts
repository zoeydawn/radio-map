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

export type Theme = 'light' | 'dark'

// Define the shape of your context, including state and updater functions
export interface AppContextProps {
  theme: Theme
  radioStations: RadioStation[]
  viewState: ViewState
  setTheme: (theme: Theme) => void
  setRadioStations: (stations: RadioStation[]) => void
  setViewState: (viewState: ViewState) => void
  getStationsByLatAndLong: () => void
  // You could add more specific updaters if needed, e.g., addRadioStation, removeRadioStation
}

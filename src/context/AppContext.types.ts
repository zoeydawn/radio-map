import { Station } from 'radio-browser-api'
import { ViewState } from 'react-map-gl/mapbox'

export type Theme = 'light' | 'dark'

// Define the shape of your context, including state and updater functions
export interface AppContextProps {
  theme: Theme
  radioStations: Station[]
  viewState: ViewState
  setTheme: (theme: Theme) => void
  setRadioStations: (stations: Station[]) => void
  setViewState: (viewState: ViewState) => void
  getStationsByLatAndLong: () => void
  // You could add more specific updaters if needed, e.g., addRadioStation, removeRadioStation
}

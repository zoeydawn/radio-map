import { Station } from 'radio-browser-api'
import { ViewState } from 'react-map-gl/mapbox'

export type Theme = 'light' | 'dark'

// Define the shape of your context, including state and updater functions
export interface AppContextProps {
  theme: Theme
  isLoading: boolean
  radioStations: Station[]
  viewState: ViewState
  selectedStation: Station | null
  isPlaying: boolean
  setTheme: (theme: Theme) => void
  setIsLoading: (isLoading: boolean) => void
  setRadioStations: (stations: Station[]) => void
  setViewState: (viewState: ViewState) => void
  getStationsByLatAndLong: (lat: number, lon: number) => void
  setSelectedStation: (station: Station | null) => void
  setIsPlaying: (isPlaying: boolean) => void
}

import { Station } from 'radio-browser-api'
import { ViewState } from 'react-map-gl/mapbox'

export type Theme = 'light' | 'dark'

export type UserLocationType = {
  ip: string
  location: {
    country: string
    region: string
    city: string
    lat: number
    lng: number
    postalCode: string
    timezone: string
    geonameId: number
  }
  as: {
    asn: number
    name: string
    route: string
    domain: string
    type: string
  }
  isp: string
}

// Define the shape of your context, including state and updater functions
export interface AppContextProps {
  theme: Theme
  isLoading: boolean
  radioStations: Station[]
  viewState: ViewState
  selectedStation: Station | null
  viewedStation: Station | null
  isPlaying: boolean
  playError: string
  favorites: Station[]
  favoritesIdsSet: Set<string>
  setTheme: (theme: Theme) => void
  setIsLoading: (isLoading: boolean) => void
  setRadioStations: (stations: Station[]) => void
  setViewState: (viewState: ViewState) => void
  getStationsByLatAndLong: (lat: number, lon: number) => void
  setSelectedStation: (station: Station | null) => void
  setViewedStation: (station: Station | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setPlayError: (error: string) => void
  addFavorite: (station: Station) => void
  removeFavorite: (station: Station) => void
}

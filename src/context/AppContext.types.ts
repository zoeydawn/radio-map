import { Station } from 'radio-browser-api'

export type Theme = 'light' | 'dark'

// Define the shape of your context, including state and updater functions
export interface AppContextProps {
  theme: Theme
  selectedStation: Station | null
  viewedStation: Station | null
  isPlaying: boolean
  playError: string
  favorites: Station[]
  favoritesIdsSet: Set<string>
  history: Station[]
  setTheme: (theme: Theme) => void
  setSelectedStation: (station: Station | null) => void
  setViewedStation: (station: Station | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setPlayError: (error: string) => void
  addFavorite: (station: Station) => void
  removeFavorite: (station: Station) => void
}

import { Station } from 'radio-browser-api'
import { RefObject } from 'react'
import { MapRef, ViewState } from 'react-map-gl/mapbox'

export type Possition = { lat: number; lon: number }

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
export interface MapContextProps {
  isLoading: boolean
  radioStations: Station[]
  viewState: ViewState
  previousPossition: Possition
  mapRef: RefObject<MapRef | null>
  setIsLoading: (isLoading: boolean) => void
  setRadioStations: (stations: Station[]) => void
  setViewState: (viewState: ViewState) => void
  getStationsByLatAndLong: (lat: number, lon: number) => void
}

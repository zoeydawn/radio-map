import { AdvancedStationQuery, RadioBrowserApi } from 'radio-browser-api'

const api = new RadioBrowserApi('Radio Map')

export const step = 100

export const stationsByGeographicArea = async (
  geo_lat: number,
  geo_long: number,
) => {
  const response = await api.searchStations({
    geo_lat,
    geo_long,
    hasGeoInfo: true,
    geo_distance: 250000,
    // limit: 100,
  } as any) // because we get a stupid error because 'AdvancedStationQuery' is not up to date.
  // console.log({ response, geo_lat, geo_long })

  return response || []
}

// stations by id
export const stationsById = async (id: string) => {
  const response = await api.getStationsById([id])

  return response || []
}

// stations by votes
export const stationsByVotes = async () => {
  const response = await api.getStationsByVotes(150) // limit of 150
  // console.log({ response })

  return response || []
}

// countries
export const countries = async () => {
  const response = await api.getCountries()
  // console.log({ response })

  return response || []
}

// "states" by country
export const states = async (countryName: string) => {
  const response = await api.getCountryStates(countryName)
  // console.log({ response })

  return response || []
}

// languages
export const languages = async () => {
  const response = await api.getLanguages()
  // console.log({ response })

  return response || []
}

// tags
export const tags = async () => {
  const response = await api.getTags(undefined, {
    hideBroken: true,
    order: 'stationcount',
    reverse: true,
  })
  // console.log({ response })

  return response || []
}

export const stationsByCountryCode = async (
  countryCode: string,
  offset: number = 0,
) => {
  const response = await api.searchStations({
    countryCode,
    limit: 100,
    offset: offset * 100,
  })
  // console.log({ response })

  return response || []
}

// export const searchStations = api.searchStations
export const searchStations = async (searchObject: AdvancedStationQuery) => {
  const offset = searchObject.offset || 0
  // console.log('searchObject:', searchObject)
  const query = searchObject
  query.limit = searchObject.limit || step
  query.offset = offset * step
  query.order = searchObject.order || 'votes'
  query.reverse = searchObject.reverse === false ? false : true
  query.hideBroken = true

  const response = await api.searchStations(searchObject)
  // console.log({ response })

  return response || []
}

// // query stations by languge and tag
// const stations = await api.searchStations({
//   language: 'english',
//   tag:'jazz'
//   limit: 100
// })

// // query stations by array of tags
// const stations = await api.searchStations({
//   tagList: ['dance','house']
// })

// // query stations with or without geolocation info
// const stations = await api.searchStations({
//   hasGeoInfo: true // not set=display all, true=show only stations with geo_info, false=show only stations without geo_info
// })

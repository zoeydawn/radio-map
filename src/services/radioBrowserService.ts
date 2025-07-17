import { RadioBrowserApi } from 'radio-browser-api'

const api = new RadioBrowserApi('Radio Map')

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
  // console.log({ response, geo_lat, geo_long })

  return response || []
}

// query stations by country code and limit to first 100 stations
// const stations = await api.searchStations({
//   countryCode: 'US',
//   limit: 100,
//   offset: 0 // this is the default - can be omited
// })

// // get next 100 stations
// const stations = await api.searchStations({
//   countryCode: 'US',
//   limit: 100,
//   offset: 1 // 1 - is the second page
// })

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

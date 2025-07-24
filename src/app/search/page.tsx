import SearchView from '@/components/SearchView'
import { countries, languages } from '@/services/radioBrowserService'
import { CountryResult } from 'radio-browser-api'

export default async function PlacesPage() {
  let countryArray: CountryResult[] = []
  let languageArray: CountryResult[] = []

  try {
    countryArray = (await countries()) || []
    languageArray = (await languages()) || []
  } catch (error) {
    console.error('error fetching search data:', error)
  }

  return <SearchView countries={countryArray} languages={languageArray} />
}

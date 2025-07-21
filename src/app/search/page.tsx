import SearchView from '@/components/SearchView'
import { countries, languages } from '@/services/radioBrowserService'

export default async function PlacesPage() {
  const countryArray = (await countries()) || []
  const languageArray = (await languages()) || []

  return <SearchView countries={countryArray} languages={languageArray} />
}

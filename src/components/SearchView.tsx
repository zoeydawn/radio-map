'use client'

import { SearchIcon } from '@/components/Icons'
import Loader from '@/components/Loader'
import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'
import { searchStations } from '@/services/radioBrowserService'
import { CountryResult, Station } from 'radio-browser-api'
import { useState } from 'react'

interface SearchViewProps {
  countries: CountryResult[]
  languages: CountryResult[]
}

const SearchView: React.FC<SearchViewProps> = ({ countries, languages }) => {
  const [radioStations, setRadioStations] = useState<Station[]>([])
  const [tagString, setTagString] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [nameString, setNameString] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false) // for initial searches
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false) // for loading additional stations
  const [offset, setOffset] = useState<number>(0)
  const { setViewedStation } = useAppContext()

  const getStations = async (currentOffset: number) => {
    const stations = await searchStations({
      tag: tagString,
      language: selectedLanguage,
      country: selectedCountry,
      name: nameString,
      offset: currentOffset,
    })

    return stations
  }

  // only to be run when the button is clicked
  const initiateSearch = async () => {
    setIsLoading(true)
    const stations = await getStations(0)

    setIsLoading(false)
    setOffset(1)
    setRadioStations(stations)
  }

  // to be run when "load more" is clicked
  const fetchMore = async () => {
    setIsLoadingMore(true)
    const stations = await getStations(offset)

    setRadioStations([...radioStations, ...stations])
    setOffset(offset + 1)
    setIsLoadingMore(false)
  }

  // check that at least one thing is selected
  const readyToSearch = !!(
    nameString ||
    tagString ||
    selectedCountry ||
    selectedLanguage
  )

  return (
    <>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
        <legend className="fieldset-legend">Search for stations</legend>

        <label className="label">Station name</label>
        <input
          type="text"
          className="input"
          placeholder="WXYC, Radio Canads, BBC, etc..."
          value={nameString}
          onChange={(event) => setNameString(event.target.value)}
        />

        <label className="label">Tag</label>
        <input
          type="text"
          className="input"
          placeholder="Reggae, jazz, news, etc..."
          value={tagString}
          onChange={(event) => setTagString(event.target.value)}
        />

        <label className="label">Country</label>
        <select defaultValue="Search by country" className="select">
          <option disabled={true}>Search by country</option>
          {countries.map(({ name }, index) => (
            <option onClick={() => setSelectedCountry(name)} key={index}>
              {name}
            </option>
          ))}
        </select>

        <label className="label">Language</label>
        <select defaultValue="Search by Language" className="select">
          <option disabled={true}>Search by Language</option>
          {languages.map(({ name }, index) => (
            <option onClick={() => setSelectedLanguage(name)} key={index}>
              {name}
            </option>
          ))}
        </select>

        <span className="label">
          All fields are optional, but you must select at least one
        </span>

        <button
          onClick={initiateSearch}
          className="btn btn-info"
          disabled={!readyToSearch}
        >
          <SearchIcon />
          Search
        </button>
      </fieldset>

      {isLoading && <Loader />}
      {!isLoading && !!radioStations.length && (
        <StationList
          stations={radioStations}
          setViewedStation={setViewedStation}
          isLoading={isLoadingMore}
          onLoadMore={fetchMore}
          // header=""
        />
      )}
    </>
  )
}

export default SearchView

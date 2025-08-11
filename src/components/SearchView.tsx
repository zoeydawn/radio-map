'use client'

import { SearchIcon } from '@/components/Icons'
import Loader from '@/components/Loader'
import StationList from '@/components/StationList'
import { useAppContext } from '@/context/AppContext'
import { fetchSearch } from '@/services/apiService'
import { step } from '@/services/radioBrowserService'
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
  const [areMoreStationsToLoad, setAreMoreStationsToLoad] =
    useState<boolean>(true)
  const { setViewedStation } = useAppContext()

  const clearAll = () => {
    setTagString('')
    setNameString('')
    setSelectedCountry('')
    setSelectedLanguage('')
  }

  const getStations = async (currentOffset: number) => {
    try {
      const response = await fetchSearch({
        tag: tagString,
        language: selectedLanguage,
        country: selectedCountry,
        name: nameString,
        offset: currentOffset,
      })
      // console.log('response:', response)

      // return stations
      return response.data
    } catch (error) {
      console.error('error fetching search:', error)
      return []
    }
  }

  // only to be run when the button is clicked
  const initiateSearch = async () => {
    setIsLoading(true)
    const stations = await getStations(0)

    setIsLoading(false)
    setOffset(1)
    setRadioStations(stations)
    setAreMoreStationsToLoad(stations.length === step)
  }

  // to be run when "load more" is clicked
  const fetchMore = async () => {
    setIsLoadingMore(true)
    const stations = await getStations(offset)

    setRadioStations([...radioStations, ...stations])
    setOffset(offset + 1)
    setIsLoadingMore(false)
    setAreMoreStationsToLoad(stations.length === step)
  }

  // check that at least one thing is selected
  const readyToSearch = !!(
    nameString ||
    tagString ||
    selectedCountry ||
    selectedLanguage
  )

  // Initiate search when `Enter` is presses
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (readyToSearch && event.key === 'Enter') {
      initiateSearch()
    }
  }

  return (
    <>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 m-auto">
        <legend className="fieldset-legend">Search for stations</legend>

        <label className="label">Station name</label>
        <input
          type="text"
          className="input"
          placeholder="WXYC, Radio Canada, BBC, etc..."
          value={nameString}
          onChange={(event) => setNameString(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="label">Tag</label>
        <input
          type="text"
          className="input"
          placeholder="Reggae, jazz, news, etc..."
          value={tagString}
          onChange={(event) => setTagString(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="label">Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="select"
        >
          <option disabled={true}></option>
          {countries.map(({ name }, index) => (
            <option key={index}>{name}</option>
          ))}
        </select>

        <label className="label">Language</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="select"
        >
          <option disabled={true}></option>
          {languages.map(({ name }, index) => (
            <option key={index}>{name}</option>
          ))}
        </select>

        <span className="label">
          All fields are optional, but you must select at least one
        </span>

        <button onClick={clearAll} className="btn btn-sm btn-ghost">
          Clear all
        </button>

        <button
          onClick={initiateSearch}
          className="btn btn-info mt-2"
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
          hideLoadButton={!areMoreStationsToLoad}
        />
      )}

      {
        // add extra space when there are no stations
        // because the player can cover up the play button on small screens
        !radioStations.length && <div className="pb-120" />
      }
    </>
  )
}

export default SearchView

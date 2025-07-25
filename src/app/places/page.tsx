import { countries } from '@/services/radioBrowserService'
import { simplifiedCountryName } from '@/utils/radioStations'
import Link from 'next/link'
import { CountryResult } from 'radio-browser-api'

// returns a className to set the size of the button based on how many stations are listed for the country
const getButtonSize = ({ stationcount }: CountryResult) => {
  if (stationcount > 2000) {
    return 'btn btn-xl'
  }
  if (stationcount > 500) {
    return 'btn btn-lg'
  }
  if (stationcount > 100) {
    return 'btn'
  }
  if (stationcount > 10) {
    return 'btn btn-sm'
  }
  return 'btn btn-xs'
}

export default async function PlacesPage() {
  try {
    const countryArray = (await countries()) || []

    return (
      <div className="flex flex-col items-center pb-50">
        <div className="w-full max-w-200 p-2">
          <h3 className="font-bold text-lg pl-2">Popular countries</h3>
          {[...countryArray]
            .sort((a, b) => b.stationcount - a.stationcount)
            .slice(0, 20)
            .map((country, index) => {
              return (
                <Link
                  className="btn btn-outline btn-primary m-2"
                  key={`${country.name}-${index}`}
                  href={`/places/${country.name}`}
                >
                  {simplifiedCountryName(country.name)}
                </Link>
              )
            })}

          <h3 className="font-bold text-lg mt-6 pl-2">All countries</h3>
          {countryArray.map((country, index) => {
            return (
              <Link
                className={`btn ${getButtonSize(country)} btn-outline btn-primary m-2`}
                key={`${country.name}-${index}`}
                href={`/places/${country.name}`}
              >
                {simplifiedCountryName(country.name)}
              </Link>
            )
          })}
        </div>
      </div>
    )
  } catch (error) {
    console.error('error feting countries:', error)

    return (
      <h3>
        There was an error fetching available places. Please try again later.
      </h3>
    )
  }
}

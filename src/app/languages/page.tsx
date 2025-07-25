import ButtonList from '@/components/ButtonList'
import { languages } from '@/services/radioBrowserService'
import { CountryResult } from 'radio-browser-api'

// returns a className to set the size of the button based on how many stations are listed for the language
const getButtonSize = ({ stationcount }: CountryResult) => {
  if (stationcount > 1000) {
    return 'btn btn-xl'
  }
  if (stationcount > 100) {
    return 'btn btn-lg'
  }
  if (stationcount > 30) {
    return 'btn'
  }
  if (stationcount > 10) {
    return 'btn btn-sm'
  }
  return 'btn btn-xs'
}

export default async function PlacesPage() {
  try {
    const languagesArray = (await languages()) || []
    const listItems = languagesArray.map((language) => {
      return {
        id: language.name,
        name: language.name,
        buttonSizeClassName: getButtonSize(language),
      }
    })
  
    return (
      <ButtonList items={listItems} baseHref="/languages" title="All Languages" />
    )

  } catch (error) {
    console.error('error in language page:', error)

    return <h3>We are having trouble fetching languages. Please try again later</h3>
  }
}

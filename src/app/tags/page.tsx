import ButtonList from '@/components/ButtonList'
import { tags } from '@/services/radioBrowserService'
import { CountryResult } from 'radio-browser-api'
/*
// returns a className to set the size of the button based on how many stations are listed for the tag */
const getButtonSize = ({ stationcount }: CountryResult) => {
  if (stationcount > 100) {
    return 'btn btn-xl'
  }
  if (stationcount > 30) {
    return 'btn btn-lg'
  }
  if (stationcount > 10) {
    return 'btn'
  }
  if (stationcount > 5) {
    return 'btn btn-sm'
  }
  return 'btn btn-xs'
}

export default async function TagsPage() {
  // const tagsArray = (await tags()) || []
  // // console.log('tags array:', tagsArray)
  // const listItems = tagsArray
  //   .sort((a, b) => b.stationcount - a.stationcount)
  //   .map((tag) => {
  //     return {
  //       id: tag.name,
  //       name: `${tag.name}`,
  //       buttonSizeClassName: getButtonSize(tag),
  //     }
  //   })

  return <ButtonList items={[]} baseHref="/tags" title="All tags" />
}

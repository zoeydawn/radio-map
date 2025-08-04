import ReloadableStationList from '@/components/ReloadableStationList'
import { searchStations } from '@/services/radioBrowserService'

export default async function Popular() {
  try {
    // stations are sorted by votes by default
    // so calling the functions without params will give us stations with the most votes
    const radioStations = (await searchStations({})) || []

    return (
      <ReloadableStationList
        initialStations={radioStations}
        header="Popular Stations"
        searchParams={{}}
      />
    )
  } catch (error) {
    console.error('error fetching stations by vote:', error)

    return <h3>Error fetching stations. Please try again later.</h3>
  }
}

import StationsByCountryList from '@/components/StationsByCountryList'
import { stationsByCountryCode } from '@/services/radioBrowserService'
import { countryCodes } from '@/utils/countryCodes'
import { Station } from 'radio-browser-api'

interface StationPageProps {
  params: Promise<{
    countryName: string
  }>
}

export default async function StationPage(props: StationPageProps) {
  const params = await props.params
  const countryCode = countryCodes[params.countryName]
  let radioStations: Station[] = []

  if (countryCode) {
    radioStations = await stationsByCountryCode(countryCode)
  }

  return (
    <StationsByCountryList
      initialStations={radioStations}
      countryName={params.countryName}
      countryCode={countryCode}
    />
  )
}

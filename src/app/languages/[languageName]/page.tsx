import ReloadableStationList from '@/components/ReloadableStationList'
import { searchStations } from '@/services/radioBrowserService'

interface StationPageProps {
  params: Promise<{
    languageName: string
  }>
}

export default async function StationPage(props: StationPageProps) {
  const params = await props.params
  const decodedName = decodeURIComponent(params.languageName || '')

  try {
    const radioStations =
      (await searchStations({ language: decodedName })) || []

    if (!radioStations.length) {
      return (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Sorry, we cannot find any stations in {decodedName}</span>
        </div>
      )
    }

    return (
      <ReloadableStationList
        initialStations={radioStations}
        header={`Radio stations in ${decodedName}`}
        searchParams={{ language: decodedName }}
      />
    )
  } catch (error) {
    console.error('error fetching stations by language:', error)

    return <h3>Error fetching stations in {decodedName}. Please try again later.</h3>
  }
}

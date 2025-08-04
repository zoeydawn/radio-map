import { toURLSearchParams } from '@/utils/urlHelpers'
import { AdvancedStationQuery, Station } from 'radio-browser-api'

interface SearchApiData {
  message: string
  searchParams: AdvancedStationQuery
  data: Station[] // Or a more specific type
}

// This is the reusable data-fetching function.
// It takes parameters as an argument.
export async function fetchSearch(
  params: AdvancedStationQuery,
): Promise<SearchApiData> {
  const urlSearchParams = toURLSearchParams(params)

  const url = `/api/search?${urlSearchParams.toString()}`
  // console.log('url:', url)
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `HTTP error! status: ${response.status}: ${errorData.message || response.statusText}`,
      )
    }

    const result: SearchApiData = await response.json()
    return result
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error // Re-throw the error so the calling component can handle it.
  }
}

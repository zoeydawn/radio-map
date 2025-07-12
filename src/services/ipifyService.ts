export const fetchEstimatedUserLocation = async () => {
  try {
    const response = await fetch('/api/user-location')

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch IP address')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('error fetching user location:', error)
  } finally {
  }
}

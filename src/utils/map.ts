// User the Haversine formula to determine if two locations are within 50km of each other
export function areLocationsWithin50Km(
  latitude: number,
  longitude: number,
  previousLatitude: number,
  previousLongitude: number,
): boolean {
  if (!previousLatitude || !previousLongitude) {
    // for when the previous location is 0
    return false
  }

  const R = 6371 // Radius of the Earth in kilometers

  const toRadians = (deg: number) => deg * (Math.PI / 180)

  const lat1Rad = toRadians(latitude)
  const lon1Rad = toRadians(longitude)
  const lat2Rad = toRadians(previousLatitude)
  const lon2Rad = toRadians(previousLongitude)

  const deltaLat = lat2Rad - lat1Rad
  const deltaLon = lon2Rad - lon1Rad

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c // Distance in kilometers
  console.log('distance:', distance)
  return distance <= 50
}

import { Station } from 'radio-browser-api'

export function combineStrings(strings: string[]): string {
  return strings.join(', ')
}

export function simpleStationDiscription({ tags, language }: Station) {
  const tagString = combineStrings(tags)
  const languageString = combineStrings(language)

  return `${tagString}${tagString && languageString ? ' - ' : ''}${languageString}`
}

export function locationString({ state, country }: Station) {
  return `${state}${state && country ? ', ' : ''}${country}`
}

export function getImageUrlForStation({ favicon }: Station) {
  return favicon
    ? `/api/image-proxy?url=${encodeURIComponent(favicon)}`
    : '/favicon.ico'
}

// as we add more stations to the state, make sure there are no duplicates
export function removeDuplicatesById(array: Station[]): Station[] {
  const seenIds = new Set<string>() // Use Set for efficient lookups
  const uniqueArray: Station[] = []

  for (const item of array) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id)
      uniqueArray.push(item)
    }
  }

  return uniqueArray
}

// because some country names are too long
export function simplifiedCountryName(country: string) {
  const simplifiedNames: { [index: string]: string } = {
    'The United Kingdom Of Great Britain And Northern Ireland':
      'United Kingdom',
    'The Democratic Peoples Republic Of Korea': 'North Korea',
    'The United States Of America': 'United States',
    'The United Arab Emirates': 'UAE',
    'The Russian Federation': 'Russia',
    'The United States Minor Outlying Islands': 'US Minor Outlying Islands',
  }

  return simplifiedNames[country] || country
}

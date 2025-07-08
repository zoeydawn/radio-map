import { Station } from 'radio-browser-api'

export function combineStrings(strings: string[]): string {
  return strings.join(', ')
}

export function simpleStationDiscription({ tags, language }: Station) {
  return `${combineStrings(tags)} - ${combineStrings(language)}`
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

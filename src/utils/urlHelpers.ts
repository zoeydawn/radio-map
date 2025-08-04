// utils/url-helpers.ts

// Define a type for the possible values, including strings, numbers, and booleans.
type ParamValue = string | number | boolean
type ParamValues = ParamValue | ParamValue[]

/**
 * Converts a plain JavaScript object into a URLSearchParams object.
 * Handles strings, numbers, booleans, and arrays of these types.
 *
 * @param params The plain object containing query parameters.
 * @returns A URLSearchParams object.
 */
export function toURLSearchParams(
  params: Record<string, ParamValues>,
): URLSearchParams {
  const urlSearchParams = new URLSearchParams()

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key]

      if (Array.isArray(value)) {
        // If the value is an array, append each item separately
        value.forEach((item) => {
          // All values are converted to a string before appending
          urlSearchParams.append(key, String(item))
        })
      } else {
        // Otherwise, append the single value
        // All values are converted to a string before appending
        urlSearchParams.append(key, String(value))
      }
    }
  }

  return urlSearchParams
}

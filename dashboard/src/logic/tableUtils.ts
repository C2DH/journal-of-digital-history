/**
 * Returns the headers from the first data row that are included in the provided headers array.
 * @param params.headers - The list of allowed headers.
 * @param params.data - The table data as an array of rows (each row is an object).
 * @returns An array of visible header strings.
 */
type GetVisibleHeadersParams = {
  data: (string | number)[][]
  headers: string[]
}
function getVisibleHeaders({ data, headers }: GetVisibleHeadersParams): string[] {
  return data.length > 0 ? Object.keys(data[0]).filter((h) => headers.includes(h)) : []
}

/**
 * Cleans the data by mapping only the visible headers and stringifying objects.
 * @param params.data - The table data as an array of row objects.
 * @param params.visibleHeaders - The headers to include in the cleaned data.
 * @returns A 2D array of cleaned values.
 */
type GetCleanDataParams = {
  data: (string | number)[][]
  visibleHeaders: string[]
}
function getCleanData({ data, visibleHeaders }: GetCleanDataParams): (string | number)[][] {
  return data.map((issue) =>
    visibleHeaders.map((header) => {
      const value = issue[header]
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value)
      }
      return value
    }),
  )
}

export { getVisibleHeaders, getCleanData }

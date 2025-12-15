import IconButton from '../../components/Buttons/IconButton/IconButton'
import Status from '../../components/Status/Status'
import Timeline from '../../components/Timeline/Timeline'
import { articleSteps } from '../constants/article'
import { isCallForPaperGithub, isDateCell, isLinkCell, isStatus } from '../helpers/checkItem'
import { Abstract } from '../types'
import { convertDate } from './convertDate'

type GetVisibleHeadersParams = {
  data: (string | number)[][]
  headers: string[]
}
/**
 * Returns the headers that are included in the provided headers array.
 * @param headers - The list of allowed headers.
 * @param data - The table data as an array of rows (each row is an object).
 * @returns An array of string which are the headers, we want to display.
 */
function getVisibleHeaders({ data, headers }: GetVisibleHeadersParams): string[] {
  if (data.length === 0) return []
  return headers.filter((header) => getNestedValue(data[0], header) !== undefined)
}

/**
 * Retrieves the value at a given nested path within an object.
 *
 * @param obj - The object to query.
 * @param path - The double underscored string representing the path to the desired value (e.g., "a__b__c").
 * @returns The value at the specified path, or `undefined` if the path does not exist.
 *
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * getNestedValue(obj, "a__b__c"); // returns 42
 * getNestedValue(obj, "a__x__c"); // returns undefined
 */
function getNestedValue(obj: any, path: string): any {
  return path
    .split('__')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

type GetCleanDataParams = {
  data: (string | number)[][]
  visibleHeaders: string[]
}
/**
 * Cleans the data by mapping only the data for selected headers.
 * @param data - The table data as an array of row objects.
 * @param visibleHeaders - The headers selected.
 * @returns A 2D array of cleaned values.
 */
function getCleanData({ data, visibleHeaders }: GetCleanDataParams): (string | number)[][] {
  return data.map((row) =>
    visibleHeaders.map((header) => {
      const value = getNestedValue(row, header)
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value)
      }
      return value
    }),
  )
}

type renderCellProps = {
  isStep: boolean
  cell: any
  header: string
  headers: string[]
  cIdx: number
  title: string
  isArticle: boolean
}
/**
 * Renders a table cell value as the appropriate React node for display.
 *
 * @param props - Properties describing the cell context:
 *   - isStep: Whether the cell represents a workflow step.
 *   - cell: The raw cell value to render.
 *   - headers: Array of table header strings.
 *   - cIdx: Index of the current column.
 *   - isArticle: Whether the row represents an article.
 * @returns A React node representing the formatted cell content, such as a Timeline, Status badge, IconButton, formatted date, or raw value.
 */

function renderCell({ isStep, cell, headers, cIdx, isArticle }: renderCellProps) {
  let content: React.ReactNode = '-'
  const headerKey = headers[cIdx].toLowerCase().split('.').join(' ')

  if (isStep && isArticle) {
    content = <Timeline steps={articleSteps} currentStatus={cell} />
  } else if (isStatus(cell, headerKey)) {
    content = <Status value={cell} />
  } else if (isLinkCell(cell)) {
    content = <IconButton value={cell} />
  } else if (isCallForPaperGithub(cell, headerKey)) {
    return (
      <IconButton value={`${import.meta.env.VITE_DASHBOARD_CALLFORPAPERS_GITHUB_URL}${cell}`} />
    )
  } else if (isDateCell(cell)) {
    content = convertDate(cell)
  } else if (cell === '' || cell === null) {
    content = '-'
  } else {
    content = cell
  }

  return content
}

/**
 * Combines 'contact_firstname' and 'contact_lastname' fields into a single 'author' column.
 *
 * @param headers - Array of header strings for the table.
 * @param data - Array of Abstract objects representing table rows.
 * @returns An object containing updated headers and data, where 'author' replaces the separate firstname and lastname columns.
 *
 * If either 'contact_firstname' or 'contact_lastname' is missing from headers, returns the original headers and data.
 */
function authorColumn(headers: string[], data: Abstract[]) {
  const fieldPairs = [
    { firstname: 'abstract__contact_firstname', lastname: 'abstract__contact_lastname' },
    { firstname: 'contact_firstname', lastname: 'contact_lastname' },
  ]

  const matchedPair = fieldPairs.find(
    (pair) => headers.includes(pair.firstname) && headers.includes(pair.lastname),
  )

  if (!matchedPair) {
    return { headers, data }
  }

  // Remove firstname and lastname headers, add 'author'
  const newHeaders = headers.filter(
    (h) => h !== matchedPair.firstname && h !== matchedPair.lastname,
  )

  newHeaders.splice(2, 0, 'author')

  // Transform data: combine firstname + lastname into author
  const newData = data.map((row) => {
    const rowAny = row as any

    const firstname = getNestedValue(rowAny, matchedPair.firstname) ?? ''
    const lastname = getNestedValue(rowAny, matchedPair.lastname) ?? ''

    const author = `${firstname} ${lastname.toUpperCase()}`.trim()

    const newRow = { ...rowAny }
    delete newRow[matchedPair.firstname]
    delete newRow[matchedPair.lastname]
    newRow.author = author

    return newRow
  })

  return { headers: newHeaders, data: newData }
}

export { authorColumn, getCleanData, getVisibleHeaders, renderCell }

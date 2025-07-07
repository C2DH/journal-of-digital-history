import { DateTime } from 'luxon'

import { articleSteps } from '../constants/article'
import { ModalInfo, RowAction } from '../types'

/**
 * Returns the headers that are included in the provided headers array.
 * @param headers - The list of allowed headers.
 * @param data - The table data as an array of rows (each row is an object).
 * @returns An array of string which are the headers, we want to display.
 */
type GetVisibleHeadersParams = {
  data: (string | number)[][]
  headers: string[]
}
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

/**
 * Cleans the data by mapping only the data for selected headers.
 * @param data - The table data as an array of row objects.
 * @param visibleHeaders - The headers selected.
 * @returns A 2D array of cleaned values.
 */
type GetCleanDataParams = {
  data: (string | number)[][]
  visibleHeaders: string[]
}
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

/**
 * Generates a list of row actions based on the current status of the row.
 *
 * @param row - The data row from which to determine available actions.
 * @param setModal - Function to open a modal dialog with action details.
 * @param t - Translation function for localizing action labels.
 * @returns An array of RowAction objects representing available actions for the row.
 */
function getRowActions(
  row: any,
  setModal: (modal: ModalInfo) => void,
  t: (key: string) => string,
): RowAction[] {
  const status = row[7]
  const id = row[0]
  const title = row[1]

  const defaultAction = (action: string, label?: string) => ({
    label: label || action,
    onClick: () =>
      setModal &&
      setModal({
        open: true,
        action,
        row,
        id,
        title,
      }),
  })

  const actions: RowAction[] = []

  if (status === 'SUBMITTED') {
    actions.push(defaultAction('Accepted'))
    actions.push(defaultAction('Declined'))
    actions.push(defaultAction('Abandoned'))
  }

  if (status === 'ACCEPTED') {
    actions.push(defaultAction('Abandoned'))
    actions.push(defaultAction('Suspended'))
  }

  return actions
}

/**
 * Checks if a string matches the ORCID identifier format.
 * @param str - The string to validate.
 * @returns True if the string is a valid ORCID, otherwise false.
 */
function isOrcid(str: string): boolean {
  // ORCID format: 0000-0000-0000-0000
  return /^0000-\d{4}-\d{4}-\d{3}[\dX]$/.test(str)
}

/**
 * Converts an ORCID identifier to its corresponding ORCID URL.
 *
 * @param orcid - The ORCID identifier string.
 * @returns The full ORCID URL as a string.
 */
function convertOrcid(orcid: string): string {
  return `https://orcid.org/${orcid}`
}

function isStepCell(cell: any): boolean {
  return typeof cell === 'string' && articleSteps.some((step) => step.key === cell.toLowerCase())
}

function isStatus(cell: any, header: string): boolean {
  return typeof cell === 'string' && header.toLowerCase() === 'status'
}

function isLinkCell(cell: any): boolean {
  return typeof cell === 'string' && (cell.startsWith('http') || isOrcid(cell))
}

function isDateCell(cell: any): boolean {
  return typeof cell === 'string' && DateTime.fromISO(cell).isValid
}

function isEmptyCell(cell: any): boolean {
  return cell === '' || cell === null
}

function isTitleHeader(headerName: string) {
  return headerName === 'title' || headerName === 'abstract__title'
}

function isFolderNameCell(cell: any, header: string): boolean {
  return typeof cell === 'string' && header.toLowerCase() === 'folder_name'
}

function isStatusHeader(headerName: string) {
  return headerName === 'status'
}

function isRepositoryHeader(headerName: string) {
  return headerName === 'repository_url'
}

function isAbstract(item: string): boolean {
  return item === 'abstracts'
}
function isArticle(item: string): boolean {
  return item === 'articles'
}
function isCallForPapers(item: string): boolean {
  return item === 'callforpapers'
}
function isIssues(item: string): boolean {
  return item === 'issues'
}

export {
  convertOrcid,
  getCleanData,
  getRowActions,
  getVisibleHeaders,
  isAbstract,
  isArticle,
  isCallForPapers,
  isDateCell,
  isEmptyCell,
  isFolderNameCell,
  isIssues,
  isLinkCell,
  isOrcid,
  isRepositoryHeader,
  isStatus,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
}

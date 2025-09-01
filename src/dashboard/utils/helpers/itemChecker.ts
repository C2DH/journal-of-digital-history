import { DateTime } from 'luxon'

import { articleSteps } from '../constants/article'

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

function isAffiliationHeader(headerName: string) {
  return headerName === 'contact_affiliation'
}

function isFirstnameHeader(headerName: string) {
  return headerName === 'abstract__contact_firstname'
}

function isLastnameHeader(headerName: string) {
  return headerName === 'abstract__contact_lastname'
}

function isCallForPaperGithub(cell: any, header: string): boolean {
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
  isAbstract,
  isAffiliationHeader,
  isArticle,
  isCallForPaperGithub,
  isCallForPapers,
  isDateCell,
  isEmptyCell,
  isFirstnameHeader,
  isIssues,
  isLastnameHeader,
  isLinkCell,
  isOrcid,
  isRepositoryHeader,
  isStatus,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
}

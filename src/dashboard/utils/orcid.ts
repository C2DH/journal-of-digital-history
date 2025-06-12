/**
 * Checks if a string matches the ORCID identifier format.
 * @param str - The string to validate.
 * @returns True if the string is a valid ORCID, otherwise false.
 */
export function isOrcid(str: string): boolean {
  // ORCID format: 0000-0000-0000-0000
  return /^0000-\d{4}-\d{4}-\d{3}[\dX]$/.test(str)
}

/**
 * Converts an ORCID identifier to its corresponding ORCID URL.
 *
 * @param orcid - The ORCID identifier string.
 * @returns The full ORCID URL as a string.
 */
export function convertOrcid(orcid: string): string {
  return `https://orcid.org/${orcid}`
}

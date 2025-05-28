export function isOrcid(str: string): boolean {
  // ORCID format: 0000-0000-0000-0000
  return /^0000-\d{4}-\d{4}-\d{3}[\dX]$/.test(str)
}

export function convertOrcid(orcid: string): string {
  return `https://orcid.org/${orcid}`
}

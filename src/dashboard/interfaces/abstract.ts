export interface Abstract {
  id: number
  pid: string
  title: string
  abstract: string
  callpaper: number | null
  submitted_date: string
  validation_date: string
  contact_orcid: string
  contact_affiliation: string
  contact_email: string
  contact_lastname: string
  contact_firstname: string
  status: string
  consented: boolean
  authors: number[]
  datasets: number[]
}

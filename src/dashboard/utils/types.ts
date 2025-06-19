/* Abstract */
export interface Abstract {
  id: number
  pid: string
  title: string
  abstract: string
  callpaper: number | null
  callpaper_title: string | null
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
  repository_url: string
}

export interface Issue {
  id: number
  pid: string
  name: string
  description: string
  creation_date: string
  publication_date: string
  cover_date: string
  status: string
  data: Record<string, any>
  volume: number
  issue: number
  is_open_ended: boolean
}

/* Article */
export interface Article {
  abstract: Abstract
  repository_url: string
  status: string
  publication_date: string | null
  repository_type: string
  copyright_type: string
  notebook_url: string
  notebook_commit_hash: string
  notebook_path: string
  binder_url: string
  doi: string
  dataverse_url: string | null
  data: Data
  citation: Record<string, any>
  kernel_language: string
  tags: string[]
  issue: Issue
  authors: any[]
  fingerprint: Fingerprint
}

interface Fingerprint {
  cells: Array<{
    tags: string[]
    type: string
    isTable: boolean
    isFigure: boolean
    countRefs: number
    isHeading: boolean
    countChars: number
    firstWords: string
    isMetadata: boolean
    isHermeneutic: boolean
  }>
  [key: string]: any
}

interface Data {
  title: string[]
  abstract: string[]
  keywords: string[]
  contributor: string[]
  [key: string]: any
}

/* Author */
export interface Author {
  id: number
  lastname: string
  firstname: string
  affiliation: string
  email: string
  orcid: string
  city: string
  country: string
  github_id: string
  bluesky_id: string | null
}

/* Callforpaper */
export interface Callforpaper {
  id: number
  title: string
  folder_name: string
  deadline_abstract: string
  deadline_article: string
}

/* Dataset */
export interface Dataset {
  id: number
  url: string
  description: string
}

/* Tag */
export interface Tag {
  id: number
  data: {
    language: string
    [key: string]: any
  }
  name: string
  category: string
}

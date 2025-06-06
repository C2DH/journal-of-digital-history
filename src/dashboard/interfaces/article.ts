import { Abstract } from './abstract'
import { Issue } from './issue'

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

import { SetURLSearchParams } from 'react-router-dom'
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
  authors: Author[]
  datasets: Dataset[]
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

export type AbstractsByCallforpaperValue = {
  title?: string
  data: Abstract[]
  error?: string
}
export type AbstractsPublished = {
  title?: string
  data: Abstract[]
  error?: string
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

export interface ModalInfo {
  open: boolean
  action?: string
  row?: any
  id?: string
  contact_email?: string
  title?: string
}

export type RowAction = {
  label: string
  onClick: () => void
}

/* Zustand store types */
export type SearchState = {
  query: string
  results: any[]
  loading: boolean
  error: any
  setQuery: (query: string) => void
  setResults: (results: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: any) => void
}

export type ItemsState<T> = {
  count: number
  data: T[]
  error: string | null
  loading: boolean
  offset: number
  hasMore: boolean
  endpoint: string
  limit: number
  ordering?: string
  search?: string
  params?: Record<string, any>
  fetchItems: (reset?: boolean) => Promise<void>
  setParams: (params: {
    ordering?: string | undefined
    endpoint?: string | undefined
    limit?: number | undefined
    search?: string | undefined
    params?: Record<string, any> | undefined
  }) => void
  reset: () => void
  loadMore: () => Promise<void>
}

export type ItemState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  fetchItem: (id: string, endpoint: string) => Promise<void>
  reset: () => void
}

export type CallForPapersState = {
  data: Callforpaper[]
  error: string | null
  fetchCallForPapers: (revert: boolean) => Promise<void>
  reset: () => void
}

export type IssuesState = {
  data: Issue[]
  error: string | null
  fetchIssues: (revert: boolean) => Promise<void>
  reset: () => void
}
export type RowCheckbox = { [pid: string]: boolean }
export type RowCheckboxMap = {
  selectAll?: boolean
}

export type FilterOption = { key: number; value: string; label: string }
export type Filter = { name: string; label: string; value: string; options: FilterOption[] }
export type SetSearchParams = SetURLSearchParams
export interface FilterBarState {
  filters: Filter[]
  initFilters: () => Filter[]
  syncFiltersWithURL: (searchParam: URLSearchParams) => void
  changeQueryParams: (isAbstract: boolean) => object
  updateFromStores: (isAbstract: boolean) => void
  changeFilters: (
    name: string,
    value: string,
    searchParams: URLSearchParams,
    setSearchParams: SetSearchParams,
  ) => void
  resetFilters: (
    searchParams: URLSearchParams,
    setSearchParams: SetSearchParams,
    filterConfig: Filter[],
  ) => void
  resetSpecificFilter: (
    searchParams: URLSearchParams,
    setSearchParams: SetSearchParams,
    name: string,
  ) => void
}

export interface FormState {
  isModalOpen: boolean
  formData: Record<string, any>
  setFormData: (data: Record<string, any>) => void
  openModal: () => void
  closeModal: () => void
}

export type NotificationType = 'success' | 'warning' | 'error' | 'info'
export type Notification = { type: NotificationType; message: string; submessage?: string }
export interface NotificationState {
  isVisible: boolean
  notification: Notification
  setNotification: (notification: Notification) => void
  clearNotification: () => void
}

/* API types */
export type APIResponse = Promise<APIResponseObject>
export type APIResponseObject = { count: number; next: null; previous: null; results: any[] }

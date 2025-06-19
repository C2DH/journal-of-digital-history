export type TableProps = {
  title: string
  headers: string[]
  data: any[]
  sortBy?: string
  sortOrder?: string
  setSortBy?: (header: string) => void
  setSortOrder?: (order: 'asc' | 'desc') => void
}

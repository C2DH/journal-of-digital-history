export type TableProps = {
  item: string
  headers: string[]
  data: any[]
  loading: boolean
  sortBy?: string
  sortOrder?: string
  setSort?: (filters: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void
  isAccordeon?: boolean
}

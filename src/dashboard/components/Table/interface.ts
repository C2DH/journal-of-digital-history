export type TableProps = {
  item: string
  headers: string[]
  data: any[]
  sortBy?: string
  sortOrder?: string
  setSort?: (filters: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void
  isAccordeon?: boolean
}

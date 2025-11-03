export type SmallTableProps = {
  item: string
  headers: string[]
  data: any[]
  sortBy?: string
  sortOrder?: string
  setSort?: (filters: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void
}

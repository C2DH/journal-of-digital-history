export type CardProps = {
  item: string
  headers: string[]
  count: number
  data: any[]
  error?: any
  loading: boolean
  hasMore: boolean
  loadMore: () => void
  sortBy?: string
  sortOrder?: string
  setSortBy?: (sortBy: string) => void
  setSortOrder?: (sortOrder: string) => void
}

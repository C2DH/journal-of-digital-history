export type CardProps = {
  item: string
  headers: string[]
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

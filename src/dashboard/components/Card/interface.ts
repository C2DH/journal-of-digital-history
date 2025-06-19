export interface CardProps {
  item: string
  headers: string[]
  data: any[]
  error: any
  loading: boolean
  hasMore: boolean
  loadMore: () => void
}

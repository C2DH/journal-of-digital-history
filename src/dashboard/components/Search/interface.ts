export interface SearchProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  activeRoutes?: string[]
}

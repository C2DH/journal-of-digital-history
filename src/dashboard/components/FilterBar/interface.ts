import { Filter } from '../../utils/types'

export interface FilterBarProps {
  filters: Filter[]
  onFilterChange: (name: string, value: string, searchParams: any, setSearchParams: any) => void
}

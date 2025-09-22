type Option = {
  key: number
  value: string
  label: string
}

interface Filter {
  name: string
  value: string
  label: string
  options: Option[]
}

export interface FilterBarProps {
  filters: Filter[]
  onFilterChange: (name: string, value: string, searchParams: any, setSearchParams: any) => void
}

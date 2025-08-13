interface Filter {
  name: string
  value: string
  options: {
    key: number
    value: string
    label: string
  }[]
}

export interface FilterBarProps {
  filters: Filter[]
  onFilterChange: (name: any, newValue: any) => void
}

import { FilterOption } from '../../utils/types'
export interface DropdownMenuProps {
  name: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  onReset: () => void
  disable?: boolean
}

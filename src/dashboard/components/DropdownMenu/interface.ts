export interface DropdownMenuProps {
  name: string
  options: {
    key: number
    value: string
    label: string
  }[]
  value: string
  onChange: (value: string) => void
}

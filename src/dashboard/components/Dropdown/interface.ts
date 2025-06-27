type Action = {
  label: string
  onClick: () => void
}

export interface DropdownProps {
  actions: Action[]
  setOpen: (open: boolean) => void
}

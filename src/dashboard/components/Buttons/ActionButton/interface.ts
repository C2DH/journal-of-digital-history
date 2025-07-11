type Action = {
  label: string
  onClick: () => void
}

export interface ActionButtonProps {
  actions: Action[]
}

export interface ModalProps {
  item: string
  open: boolean
  onClose: () => void
  action: string
  data?: any
  onAction?: (action: string, ids: string[]) => void
}

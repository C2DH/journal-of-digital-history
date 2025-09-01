export interface ModalProps {
  item: string
  open: boolean
  onClose: () => void
  action: string
  ids?: string[]
  data?: any
  onAction?: (action: string, ids: string[]) => void
  onNotify?: (notification: {
    type: 'success' | 'error'
    message: string
    submessage?: string
  }) => void
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  action: string
  ids?: string[]
  rowData?: any
  onAction?: (action: string, ids: string[]) => void
  onNotify?: (notification: {
    type: 'success' | 'error'
    message: string
    submessage?: string
  }) => void
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  action: string
  rowData?: any // Optional raw data for more complex modals
  onNotify?: (notification: {
    type: 'success' | 'error'
    message: string
    submessage?: string
  }) => void
}

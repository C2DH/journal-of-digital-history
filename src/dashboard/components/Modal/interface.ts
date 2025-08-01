export interface ModalProps {
  open: boolean
  onClose: () => void
  action: string
  rowData?: any // Optional raw data for more complex modals
  // contactEmail?: string
  // pid?: string
  // title: string
}

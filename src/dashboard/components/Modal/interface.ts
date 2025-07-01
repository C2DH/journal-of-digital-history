export interface ModalProps {
  open: boolean
  onClose: () => void
  action: string
  contactEmail?: string
  pid?: string
  title: string
}

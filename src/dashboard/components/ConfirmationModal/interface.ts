export interface ConfirmationModalProps {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

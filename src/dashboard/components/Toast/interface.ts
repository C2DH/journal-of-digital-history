export interface ToastProps {
  open: boolean
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  onClose?: () => void
}

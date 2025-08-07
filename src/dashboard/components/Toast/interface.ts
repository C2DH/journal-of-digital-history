export interface ToastProps {
  open: boolean
  message: string
  submessage?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  onClose?: () => void
}

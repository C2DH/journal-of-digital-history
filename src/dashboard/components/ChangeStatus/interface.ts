export interface ChangeStatusProps {
  item: string
  selectedRows: { pid: string; title: string }[]
  onClose: () => void
  onNotify: (notification: {
    type: 'success' | 'error'
    message: string
    submessage?: string
  }) => void
}

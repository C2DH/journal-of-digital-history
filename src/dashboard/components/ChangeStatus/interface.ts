import { Notification } from '../../utils/types'

export interface ChangeStatusProps {
  item: string
  selectedRows: { pid: string; title: string }[]
  onClose: () => void
  onNotify: (notification: Notification) => void
}

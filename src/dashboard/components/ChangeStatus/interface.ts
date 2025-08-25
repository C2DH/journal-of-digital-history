export interface ChangeStatusProps {
  item: string
  selectedRows: { pid: string; title: string }[]
  status: string
  setStatus: (status: string) => void
  onClose: () => void
}

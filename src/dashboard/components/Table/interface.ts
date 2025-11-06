import { RowCheckboxMap } from '../../utils/types'

export type TableProps = {
  item: string
  headers: string[]
  data: any[]
  checkedRows: RowCheckboxMap
  setCheckedRows: React.Dispatch<React.SetStateAction<RowCheckboxMap>>
  sortBy?: string
  sortOrder?: string
  setSort?: (filters: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void
  setRowModal?: (modal: { open: boolean; action?: string; row?: any; id?: string }) => void
  isAccordeon?: boolean
}

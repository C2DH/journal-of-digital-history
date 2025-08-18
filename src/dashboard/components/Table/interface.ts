import { RowCheckboxMap } from '../../utils/types'

export type TableProps = {
  item: string
  headers: string[]
  data: any[]
  checkedRows: RowCheckboxMap
  setCheckedRows: React.Dispatch<React.SetStateAction<RowCheckboxMap>>
  sortBy?: string
  sortOrder?: string
  setSortBy?: (header: string) => void
  setSortOrder?: (order: 'asc' | 'desc') => void
  setRowModal?: (modal: { open: boolean; action?: string; row?: any; id?: string }) => void
  isAccordeon?: boolean
}

export interface renderCellProps {
  isStep: boolean
  cell: any
  header: string
  headers: string[]
  cIdx: number
  title: string

  isArticle: boolean
}

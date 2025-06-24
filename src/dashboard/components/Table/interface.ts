export type TableProps = {
  item: string
  headers: string[]
  data: any[]
  sortBy?: string
  sortOrder?: string
  setSortBy?: (header: string) => void
  setSortOrder?: (order: 'asc' | 'desc') => void
  setModal?: (modal: { open: boolean; action?: string; row?: any }) => void
}

export interface renderCellProps {
  isStep: boolean
  cell: any
  header: string
  headers: string[]
  cIdx: number
  title: string
  isAbstract: boolean
  isArticle: boolean
  isIssues: boolean
}

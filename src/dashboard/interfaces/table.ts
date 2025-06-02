export type TableProps = {
  title: string
  headers: string[]
  data: (string | number)[][]
  onRowClick?: (row: any) => void
}

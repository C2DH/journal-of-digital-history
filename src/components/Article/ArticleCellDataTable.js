import React from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  // sortingFns,
  useReactTable,
  // PaginationState,
} from '@tanstack/react-table'
import DebouncedInput from '../DebouncedInput'
import './ArticleCellDataTable.css'
import { useTranslation } from 'react-i18next'
// import {
//   RankingInfo,
//   rankItem,
//   compareItems,
// } from '@tanstack/match-sorter-utils'
const columnHelper = createColumnHelper()

const ColumnFilter = ({ column }) => {
  const columnFilterValue = column.getFilterValue()
  return (
    <DebouncedInput
      type="text"
      value={columnFilterValue ?? ''}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
      className="w-36 border shadow rounded"
      list={column.id + 'list'}
    />
  )
}

const ArticleCellDataTable = ({ cellIdx = -1, htmlContent = '' }) => {
  const { t } = useTranslation()
  const [columnFilters, setColumnFilters] = React.useState([])
  // htmlContent is "<table>\n<thead>\n<tr>\n<th>Use Case</th>\n<th>Cell Type</th>\n<th>Content Type</th>\n<th>Tag</th>\n<th>Caption</th>\n</tr>\n</thead>"
  // get the table headers from the htmlContent"
  // const tableHeaders = htmlContent.split('<th>')
  const thValues = React.useMemo(
    () =>
      htmlContent.match(/<th>(.*?)<\/th>/g)?.map((th) => {
        const v = th.replace(/<\/?th>/g, '')
        return v
      }),
    [],
  )
  // Create the table and pass your options
  const columns = React.useMemo(() => thValues.map((v) => columnHelper.accessor(v), []))

  const data = React.useMemo(
    () =>
      htmlContent
        .split('<tbody>')
        .pop()
        .match(/<tr>[\s\S]*?<\/tr>/g)
        ?.map((tr) => {
          const v = tr.replace(/<\/?tr>/g, '')
          const tdValues = v.match(/<td>(.*?)<\/td>/g).reduce((acc, td, i) => {
            const v = td.replace(/<\/?td>/g, '')
            const header = thValues[i]
            acc[header] = v
            return acc
          }, {})
          return tdValues
        }) || [],
    [],
  )
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const columnFilterId = table.getState().columnFilters[0]?.id

  React.useEffect(() => {
    console.debug(
      '[ArticleCellDataTable] @useEffect \n - cellIdx:',
      cellIdx,
      '\n - columnFilterId:',
      columnFilterId,
    )
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [columnFilterId])

  const displayedRows = table.getRowModel().rows
  return (
    <div className="ArticleCellDataTable">
      <p
        className="text-small px-2"
        dangerouslySetInnerHTML={{
          __html: t(columnFilterId ? 'numbers.datatableRowsFiltered' : 'numbers.datatableRows', {
            total: data.length,
            n: displayedRows.length,
          }),
        }}
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id}>
                    {header.id}
                    {header.column.getCanFilter() ? <ColumnFilter column={header.column} /> : null}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      dangerouslySetInnerHTML={{
                        __html: cell.renderValue(),
                      }}
                    />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="d-flex align-items-center">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
    </div>
  )
}

export default ArticleCellDataTable

import React from 'react'
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
} from 'react-feather'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

const ColumnSorting = ({ column }) => {
  const columnSortingValue = column.getIsSorted()
  const sortBy = (direction) => {
    console.debug('[ColumnSorting] sortBy', direction, 'columnSortingValue', columnSortingValue)
    if (columnSortingValue === direction) {
      column.clearSorting()
    } else {
      column.toggleSorting(direction !== 'asc')
    }
  }
  return (
    <div className={`ColumnSorting input-group input-group-sm ${columnSortingValue}`}>
      <button
        className={`btn btn-sm btn-outline-secondary p-1 ${
          columnSortingValue === 'asc' ? 'active' : ''
        }`}
        onClick={() => sortBy('asc')}
      >
        <ChevronDown size={15} />
      </button>
      <button
        className={`btn btn-sm btn-outline-secondary p-1 ${
          columnSortingValue === 'desc' ? 'active' : ''
        }`}
        onClick={() => sortBy('desc')}
      >
        <ChevronUp size={15} />
      </button>
    </div>
  )
}

const ArticleCellDataTable = ({
  cellIdx = -1,
  htmlContent = '',
  allowFilterColumn = false,
  allowSorting = true,
}) => {
  const { t } = useTranslation()
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])

  const [globalFilter, setGlobalFilter] = React.useState('')
  // htmlContent is "<table>\n<thead>\n<tr>\n<th>Use Case</th>\n<th>Cell Type</th>\n<th>Content Type</th>\n<th>Tag</th>\n<th>Caption</th>\n</tr>\n</thead>"
  // get the table headers from the htmlContent"
  // const tableHeaders = htmlContent.split('<th>')
  const thValues = React.useMemo(
    () =>
      // e.g. test with '<th class="">Titolo</th>'.match(/<th[^>]*>(.*?)<\/th>/g)
      htmlContent
        .split('</tr>')
        .shift()
        .match(/<th[^>]*>(.*?)<\/th>/g)
        ?.map((th, i) => {
          const v = th.replace(/<th[^>]*>/g, '').replace(/<\/?th>/g, '')
          return typeof v !== 'string' || v.length === 0 ? String('c' + i) : v
        }) || [],
    [],
  )
  // Create the table and pass your options
  const columns = React.useMemo(() => thValues.map((v) => columnHelper.accessor(v), []))

  const data = React.useMemo(
    () =>
      htmlContent
        .split('<tbody>')
        .pop()
        .match(/<tr[^>]*>[\s\S]*?<\/tr>/g)
        ?.map((tr) => {
          const v = tr.replace(/<tr[^>]*>/g, '').replace(/<\/?tr>/g, '')

          const tdValues =
            v.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/g)?.reduce((acc, td, i) => {
              const v = td.replace(/<t[dh][^>]*>/g, '').replace(/<\/?t[dh]>/g, '')
              const header = thValues[i]
              acc[header] = v
              return acc
            }, {}) || {}
          return tdValues
        }) || [],
    [],
  )

  if (cellIdx === 86) {
    console.debug(
      '[ArticleCellDataTable] creating table ... \n - cellIdx:',
      cellIdx,
      '\n - columns:',
      columns,
      '\n - data:',
      data,
    )
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const columnFilterId = table.getState().columnFilters[0]?.id
  const isFiltered = columnFilterId !== undefined || globalFilter !== ''
  React.useEffect(() => {
    console.debug(
      '[ArticleCellDataTable] @useEffect \n - cellIdx:',
      cellIdx,
      '\n - columns:',
      columns,
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
  const pageSize = table.getState().pagination.pageSize
  const currentPage = table.getState().pagination.pageIndex
  const startOffset = currentPage * pageSize + 1
  const endOffset = Math.min(
    (currentPage + 1) * pageSize,
    isFiltered ? displayedRows.length : data.length,
  )

  console.debug('[ArticleCellDataTable] rendered \n - cellIdx:', cellIdx)
  return (
    <div className="ArticleCellDataTable">
      {/* Pagination */}
      {data.length > 10 ? (
        <section className="ArticleCellDataTable__pagination p-2">
          {/* <p
            className="text-small px-2"
            dangerouslySetInnerHTML={{
              __html: t(
                columnFilterId ? 'numbers.datatableRowsFiltered' : 'numbers.datatableRows',
                {
                  total: data.length,
                  n: displayedRows.length,
                },
              ),
            }}
          /> */}
          <div className="input-group input-group-sm ">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              className="btn btn-sm  btn-outline-secondary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={15} />
            </button>
            <span
              className="input-group-text"
              dangerouslySetInnerHTML={{
                __html: t(
                  isFiltered
                    ? 'numbers.datatablePaginatedRowsFiltered'
                    : 'numbers.datatablePaginatedRows',
                  {
                    total: data.length,
                    n: displayedRows.length,
                    startOffset,
                    endOffset,
                  },
                ),
              }}
            ></span>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={15} />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={15} />
            </button>
          </div>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="mx-2 border border-dark form-control form-control-sm"
            placeholder="Search all columns..."
          />
          <select
            className="form-select form-select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 50, 100, 200]
              .filter((d) => {
                return d <= data.length
              })
              .concat([data.length])
              .map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {t(
                    pageSize === data.length
                      ? 'numbers.datatableShowAllRows'
                      : 'numbers.datatableShowRows',
                    {
                      n: pageSize,
                    },
                  )}
                </option>
              ))}
          </select>
        </section>
      ) : null}
      {/* Table :) */}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id}>
                    {header.id}
                    {allowFilterColumn && header.column.getCanFilter() ? (
                      <ColumnFilter column={header.column} />
                    ) : null}
                    {allowSorting && header.column.getCanSort() ? (
                      <ColumnSorting column={header.column} />
                    ) : null}
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
    </div>
  )
}

export default ArticleCellDataTable

import './SmallTable.css'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { SmallTableProps } from './interface'

import { isPidHeader, isStepCell, isTitleHeader } from '../../utils/helpers/checkItem'
import {
  authorColumn,
  getCleanData,
  getVisibleHeaders,
  renderCell,
} from '../../utils/helpers/table'

const SmallTable = ({ item, headers, data }: SmallTableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const { headers: mergedHeaders, data: mergedData } = authorColumn(headers, data)
  const visibleHeaders = getVisibleHeaders({ data: mergedData, headers: mergedHeaders })
  const cleanData = getCleanData({ data: mergedData, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${item}/${pid}${search}`)
  }

  return (
    <>
      <table className={`table ${item}`}>
        <thead>
          <tr>
            {visibleHeaders.map((header) => {
              const isPid = isPidHeader(header)
              const isTitle = isTitleHeader(header)

              return (
                !isPid && (
                  <th
                    key={header}
                    className={`${header}`}
                    colSpan={isTitle ? 2 : 0}
                    title={t(`${item}.${header}`)}
                  >
                    {t(`${item}.${header}`)}
                  </th>
                )
              )
            })}
          </tr>
        </thead>
        <tbody>
          {cleanData.map((row, rIdx) => {
            return (
              <tr key={rIdx}>
                {row.map((cell: string | number, cIdx: number) => {
                  const headerName = headers[cIdx]
                  const isPid = isPidHeader(headerName)
                  const isTitle = isTitleHeader(headerName)
                  const isStep = isStepCell(cell)

                  return (
                    !isPid && (
                      <td
                        key={cIdx}
                        className={headerName}
                        colSpan={isTitle ? 2 : 0}
                        title={String(cell)}
                        style={isTitle ? { cursor: 'pointer' } : undefined}
                        onClick={isTitle ? () => handleRowClick(String(row[0])) : undefined}
                      >
                        {renderCell({
                          isStep,
                          cell,
                          header: headerName,
                          headers,
                          cIdx,
                          title: item,
                          isArticle: false,
                        })}
                      </td>
                    )
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default SmallTable

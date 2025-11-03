import './SmallTable.css'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { SmallTableProps } from './interface'

import { isStepCell, isTitleHeader } from '../../utils/helpers/checkItem'
import { getCleanData, getVisibleHeaders, renderCell } from '../../utils/helpers/table'

const SmallTable = ({ item, headers, data }: SmallTableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${item}/${pid}${search}`)
  }

  return (
    <>
      <table className={`table ${item}`}>
        <thead>
          <tr>
            {visibleHeaders.map((header) => (
              <th key={header} className={`${header}`}>
                {t(`${item}.${header}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cleanData.map((row, rIdx) => {
            return (
              <tr key={rIdx}>
                {row.map((cell: string | number, cIdx: number) => {
                  const headerName = headers[cIdx]
                  const isTitle = isTitleHeader(headerName)
                  const isStep = isStepCell(cell)

                  return (
                    <td
                      key={cIdx}
                      className={headerName}
                      title={isTitle ? String(cell) : undefined}
                      colSpan={0}
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

import './SmallTable.css'

import Skeleton from '@mui/material/Skeleton'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SmallTableProps } from './interface'

import clickChart from '../../../assets/images/click_chart_horizontal3.svg?url'
import { isPidHeader, isStepCell, isTitleHeader } from '../../utils/helpers/checkItem'
import {
  authorColumn,
  getCleanData,
  getValueInSpecificOrder,
  getVisibleHeaders,
  renderCell,
} from '../../utils/helpers/table'

const SmallTable = ({ item, headers, data, placeholder, loading }: SmallTableProps) => {
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
      <table className={`smalltable ${item}`}>
        <thead>
          <tr>
            {visibleHeaders.map((header) => {
              const isPid = isPidHeader(header)
              const isTitle = isTitleHeader(header)

              return (
                !isPid && (
                  <th
                    key={header}
                    className={`smalltable-${header}`}
                    colSpan={isTitle ? 2 : 1}
                    title={t(`${item}.${header}`)}
                  >
                    {t(`${item}.${header}`)}
                  </th>
                )
              )
            })}
          </tr>
        </thead>
        {placeholder && (
          <tbody className="placeholder-body">
            <tr>
              <th className="placeholder-body-header" colSpan={5}>
                {loading ? (
                  <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </>
                ) : (
                  <>
                    <img src={clickChart} className="placeholder-image" />
                    <h3>{t(`KPI.peerReviewChart.table.placeholder`)}</h3>
                    <h5>{t(`KPI.peerReviewChart.table.indication`)}</h5>
                  </>
                )}
              </th>
            </tr>
          </tbody>
        )}
        {!placeholder && (
          <tbody>
            {cleanData.map((row, rIdx) => {
              const cells = getValueInSpecificOrder(visibleHeaders, row)

              return (
                <tr key={rIdx}>
                  {cells.map((cell: string | number, cIdx: number) => {
                    const headerName = visibleHeaders[cIdx]
                    const isPid = isPidHeader(headerName)
                    const isTitle = isTitleHeader(headerName)
                    const isStep = isStepCell(cell)

                    return (
                      !isPid && (
                        <td
                          key={cIdx}
                          className={`smalltable-${headerName}`}
                          colSpan={isTitle ? 2 : 1}
                          title={String(cell)}
                          style={isTitle ? { cursor: 'pointer' } : undefined}
                          onClick={isTitle ? () => handleRowClick(String(cells[0])) : undefined}
                        >
                          {renderCell({
                            isStep,
                            cell,
                            header: headerName,
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
        )}
      </table>
    </>
  )
}

export default SmallTable

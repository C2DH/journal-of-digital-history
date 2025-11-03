import './SmallTable.css'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { SmallTableProps } from './interface'

import {
  isAbstract,
  isAffiliationHeader,
  isArticle,
  isCallForPapers,
  isFirstnameHeader,
  isIssues,
  isLastnameHeader,
  isRepositoryHeader,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
} from '../../utils/helpers/checkItem'
import { getCleanData, getVisibleHeaders, renderCell } from '../../utils/helpers/table'
import SortButton from '../Buttons/SortButton/SortButton'

const SmallTable = ({ item, headers, data, sortBy, sortOrder, setSort }: SmallTableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${item}/${pid}${search}`)
  }

  const handleSort = (header: string) => {
    if (!setSort) return
    setSort({
      sortBy: header,
      sortOrder: sortOrder === 'desc' ? 'asc' : 'desc',
    })
  }

  // Compute visual state of master checkbox
  const isAbstractItem = isAbstract(item)
  const isArticleItem = isArticle(item)
  const isArticleOrAbstracts = isAbstractItem || isArticleItem
  const isUnsortableHeader = (header: any, item: any) => {
    return (
      isFirstnameHeader(header) ||
      isLastnameHeader(header) ||
      isCallForPapers(item) ||
      (isIssues(item) && !isRepositoryHeader(header) && !isStatusHeader(header))
    )
  }

  return (
    <>
      <table className={`table ${item}`}>
        <thead>
          <tr>
            {visibleHeaders.map((header) => (
              <th key={header} className={`${header}`}>
                {isUnsortableHeader(header, item) ? (
                  t(`${item}.${header}`)
                ) : (
                  <SortButton
                    active={sortBy === header}
                    order={sortOrder}
                    onClick={() => handleSort(header)}
                    label={t(`${item}.${header}`)}
                  />
                )}
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
                  const isAffiliation = isAffiliationHeader(headerName)
                  const isStep = isStepCell(cell)

                  return (
                    <td
                      key={cIdx}
                      className={headerName}
                      title={isTitle || isAffiliation ? String(cell) : undefined}
                      colSpan={0}
                      style={isTitle && isArticleOrAbstracts ? { cursor: 'pointer' } : undefined}
                      onClick={
                        isTitle && isArticleOrAbstracts
                          ? () => handleRowClick(String(row[0]))
                          : undefined
                      }
                    >
                      {renderCell({
                        isStep,
                        cell,
                        header: headerName,
                        headers,
                        cIdx,
                        title: item,
                        isArticle: isArticleItem,
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

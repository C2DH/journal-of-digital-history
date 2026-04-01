import './Table.css'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TableProps } from './interface'

import { useIsMobile } from '../../hooks/useIsMobile'
import { useActionStore } from '../../store'
import { articleSteps } from '../../utils/constants/article'
import {
  isAbstract,
  isAffiliationHeader,
  isArticle,
  isAuthorHeader,
  isCallForPaper,
  isIssues,
  isPidHeader,
  isRepositoryHeader,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
} from '../../utils/helpers/checkItem'
import {
  authorColumn,
  getCleanData,
  getValueInSpecificOrder,
  getVisibleHeaders,
  renderCell,
} from '../../utils/helpers/table'
import { AbstractRow, ArticleRow } from '../../utils/types'
import ActionButton from '../Buttons/ActionButton/Short/ActionButton'
import DatasetButton from '../Buttons/DatasetButton/DatasetButton'
import SortButton from '../Buttons/SortButton/SortButton'

const ArticleHeader = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      {!isMobile &&
        articleSteps.map((step) => (
          <th key={step.key} className="status-header" title={step.label}>
            {step.icon}
          </th>
        ))}
      {isMobile && <th className="article-header-mobile">Status</th>}
    </>
  )
}

const Table = ({
  item,
  headers,
  data,
  sortBy,
  sortOrder,
  setSort,
  isAccordeon = false,
}: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search
  const [isMobile, setIsMobile] = useState(false)

  const { getRowActions } = useActionStore()

  const isAbstractItem = isAbstract(item)
  const isArticleItem = isArticle(item)
  const isArticleOrAbstracts = isAbstractItem || isArticleItem

  // Create author column
  const { headers: mergedHeaders, data: mergedData } = authorColumn(headers, data)
  const visibleHeaders = getVisibleHeaders({ data: mergedData, headers: mergedHeaders })
  const cleanData = getCleanData({
    data: mergedData,
    visibleHeaders,
    isArticle: isArticleItem,
    isAbstract: isAbstractItem,
  })

  //Remove sorting on some headers
  const isUnsortableHeader = (header: any, item: any) => {
    const isAccordeonHeader =
      isAccordeon && (isStatusHeader(header) || isTitleHeader(header) || isPidHeader(header))
    const isIssuesHeader = isIssues(item) && !isRepositoryHeader(header) && !isStatusHeader(header)
    const isAuthor = isArticleOrAbstracts && isAuthorHeader(header)

    return (
      isRepositoryHeader(header) ||
      isCallForPaper(item) ||
      isAccordeonHeader ||
      isIssuesHeader ||
      isAuthor ||
      isPidHeader(header)
    )
  }

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

  useIsMobile(setIsMobile)

  // No table for datasets but a list
  if (item === 'datasets') {
    return (
      <>
        {data.map((row, index) => (
          <DatasetButton key={index} url={String(row.url)} description={String(row.description)} />
        ))}
      </>
    )
  }

  return (
    <>
      <table className={`${isAccordeon ? 'accordeon' : ''} table ${item}`}>
        <thead>
          <tr>
            {visibleHeaders.map((header) =>
              header === 'status' && isArticleItem ? (
                <ArticleHeader isMobile={isMobile} />
              ) : (
                <th key={header} className={`${isAccordeon ? 'accordeon' : ''} ${header}`}>
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
              ),
            )}
            {isArticleOrAbstracts && !isAccordeon && <th className="actions-cell"></th>}
          </tr>
        </thead>
        <tbody>
          {cleanData.map((row, rIdx) => {
            const actions = getRowActions(row, isArticleItem)

            const cells = getValueInSpecificOrder(visibleHeaders, row)

            return (
              <tr key={rIdx}>
                {cells.map((cell: string | number, cIdx: number) => {
                  const headerName = visibleHeaders[cIdx]
                  const isTitle = isTitleHeader(headerName)
                  const isAffiliation = isAffiliationHeader(headerName)
                  const isStep = isStepCell(cell)

                  return (
                    <td
                      key={cIdx}
                      className={`${isAccordeon ? 'accordeon' : ''} ${headerName}`}
                      title={isTitle || isAffiliation ? String(cell) : undefined}
                      colSpan={isStep && isArticleItem && !isMobile ? 8 : 1}
                      style={isTitle && isArticleOrAbstracts ? { cursor: 'pointer' } : undefined}
                      onClick={
                        isTitle && isArticleOrAbstracts
                          ? () =>
                              handleRowClick(
                                (row as AbstractRow).pid ?? (row as ArticleRow).abstract__pid,
                              )
                          : undefined
                      }
                    >
                      {renderCell({
                        isStep,
                        cell,
                        header: headerName,
                        isArticle: isArticleItem,
                      })}
                    </td>
                  )
                })}
                {isArticleOrAbstracts && !isAccordeon && (
                  <td className="actions-cell">
                    {<ActionButton actions={actions} active={actions.length > 0} />}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Table

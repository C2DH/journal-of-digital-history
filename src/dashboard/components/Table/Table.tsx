import './Table.css'

import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TableProps } from './interface'

import { useIsMobile } from '../../hooks/useIsMobile'
import { articleSteps } from '../../utils/constants/article'
import { getRowActions } from '../../utils/helpers/actions'
import {
  isAbstract,
  isAffiliationHeader,
  isArticle,
  isCallForPaper,
  isIssues,
  isRepositoryHeader,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
} from '../../utils/helpers/checkItem'
import {
  authorColumn,
  getCleanData,
  getVisibleHeaders,
  renderCell,
} from '../../utils/helpers/table'
import ActionButton from '../Buttons/ActionButton/Short/ActionButton'
import DatasetButton from '../Buttons/DatasetButton/DatasetButton'
import SortButton from '../Buttons/SortButton/SortButton'

const ArticleHeader = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      {!isMobile &&
        articleSteps.map((step) => (
          <th key={step.key} className="status-header" title={step.label}>
            <span className="material-symbols-outlined">{step.icon}</span>
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
  setRowModal,
  onNotify,
}: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)

  const { headers: mergedHeaders, data: mergedData } = authorColumn(headers, data)
  const visibleHeaders = getVisibleHeaders({ data: mergedData, headers: mergedHeaders })
  const cleanData = getCleanData({ data: mergedData, visibleHeaders })

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

  const isAbstractItem = isAbstract(item)
  const isArticleItem = isArticle(item)
  const isArticleOrAbstracts = isAbstractItem || isArticleItem
  const isUnsortableHeader = (header: any, item: any) => {
    return (
      isRepositoryHeader(header) ||
      isCallForPaper(item) ||
      (isIssues(item) && !isRepositoryHeader(header) && !isStatusHeader(header))
    )
  }

  useIsMobile(setIsMobile)

  // No table for datasets
  if (item === 'datasets') {
    return (
      <>
        {cleanData.map((row, index) => (
          <DatasetButton key={index} url={String(row[0])} description={String(row[1])} />
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
            return (
              <tr key={rIdx}>
                {row.map((cell: string | number, cIdx: number) => {
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
                          ? () => handleRowClick(String(row[0]))
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
                    {setRowModal && !loading && (
                      <ActionButton
                        actions={getRowActions(
                          row,
                          isArticleItem,
                          setRowModal,
                          onNotify,
                          setLoading,
                        )}
                        active={
                          getRowActions(row, isArticleItem, setRowModal, onNotify, setLoading)
                            .length > 0
                        }
                      />
                    )}
                    {loading && <CircularProgress color="inherit" size={20} />}
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

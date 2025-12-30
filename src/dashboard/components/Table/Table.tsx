import './Table.css'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TableProps } from './interface'

import CustomTooltip from '../../../components/Tooltip'
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
import LinkButton from '../Buttons/LinkButton/LinkButton'
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
  checkedRows,
  // setCheckedRows,
  setRowModal,
}: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const [isMobile, setIsMobile] = useState(false)

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

  // Compute visual state of master checkbox
  const isRowChecked = (pid: string): boolean => {
    if (checkedRows.selectAll) {
      checkedRows.selectAll = true
      return checkedRows[pid] !== false
    } else {
      return checkedRows[pid] === true
    }
  }

  // Compute master checkbox state
  let allLoadedChecked = false
  if (isArticleOrAbstracts && !isAccordeon) {
    const totalLoaded = cleanData.length
    const checkedLoadedCount = cleanData.filter((row) => isRowChecked(String(row[0]))).length
    allLoadedChecked = totalLoaded > 0 && checkedLoadedCount === totalLoaded
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // No table for datasets
  if (item === 'datasets') {
    return (
      <>
        {cleanData.map((row, index) => (
          <div key={index} className="dataset">
            <LinkButton key={index} url={String(row[0])} />
            <CustomTooltip fieldname="description" index={0} text={String(row[1])} icon="info" />
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      <table className={`${isAccordeon ? 'accordeon' : ''} table ${item}`}>
        <thead>
          <tr>
            {
              isArticleOrAbstracts && !isAccordeon
              // && (
              //   <th className="checkbox-header">
              //     <Checkbox
              //       isHeader={true}
              //       checked={allLoadedChecked}
              //       onChange={(checked) => {
              //         if (checked) {
              //           const newMap: Record<string, boolean> = {}
              //           cleanData.forEach((row) => {
              //             newMap[String(row[0])] = true
              //           })
              //           setCheckedRows({ selectAll: true })
              //         } else {
              //           setCheckedRows({ selectAll: false })
              //         }
              //       }}
              //     />
              //   </th>
              // )
            }
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
            {isArticleOrAbstracts && <th className="actions-cell"></th>}
          </tr>
        </thead>
        <tbody>
          {cleanData.map((row, rIdx) => {
            return (
              <tr key={rIdx}>
                {
                  isArticleOrAbstracts && !isAccordeon
                  // &&
                  // (
                  //   <td>
                  //     <Checkbox
                  //       checked={isRowChecked(String(row[0]))}
                  //       onChange={(checked) => {
                  //         setCheckedRows((prev) => {
                  //           const newState = { ...prev }
                  //           const pid = String(row[0])
                  //           if (checkedRows.selectAll) {
                  //             if (checked) {
                  //               delete newState[pid]
                  //             } else {
                  //               newState[pid] = false
                  //             }
                  //           } else {
                  //             if (checked) {
                  //               newState[pid] = true
                  //             } else {
                  //               delete newState[pid]
                  //             }
                  //           }
                  //           return newState
                  //         })
                  //       }}
                  //     />{' '}
                  //   </td>
                  // )
                }
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
                        headers: visibleHeaders,
                        cIdx,
                        title: item,
                        isArticle: isArticleItem,
                      })}
                    </td>
                  )
                })}
                {isArticleOrAbstracts && (
                  <td className="actions-cell">
                    {setRowModal && (
                      <ActionButton
                        actions={getRowActions(isArticleItem, row, setRowModal, t)}
                        active={getRowActions(isArticleItem, row, setRowModal, t).length > 0}
                      />
                    )}
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

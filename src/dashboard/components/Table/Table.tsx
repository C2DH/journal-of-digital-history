import './Table.css'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { renderCellProps, TableProps } from './interface'

import { articleSteps } from '../../utils/constants/article'
import { convertDate } from '../../utils/helpers/convertDate'
import {
  isAbstract,
  isAffiliationHeader,
  isArticle,
  isCallForPaperGithub,
  isCallForPapers,
  isDateCell,
  isFirstnameHeader,
  isIssues,
  isLastnameHeader,
  isLinkCell,
  isRepositoryHeader,
  isStatus,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
} from '../../utils/helpers/itemChecker'
import { getCleanData, getRowActions, getVisibleHeaders } from '../../utils/helpers/table'
import ActionButton from '../Buttons/ActionButton/Short/ActionButton'
import IconButton from '../Buttons/IconButton/IconButton'
import SortButton from '../Buttons/SortButton/SortButton'
import Checkbox from '../Checkbox/Checkbox'
import Status from '../Status/Status'
import Timeline from '../Timeline/Timeline'

function renderCell({ isStep, cell, headers, cIdx, isArticle }: renderCellProps) {
  let content: React.ReactNode = '-'
  const headerKey = headers[cIdx].toLowerCase().split('.').join(' ')

  if (isStep && isArticle) {
    content = <Timeline steps={articleSteps} currentStatus={cell} />
  } else if (isStatus(cell, headerKey)) {
    content = <Status value={cell} />
  } else if (isLinkCell(cell)) {
    content = <IconButton value={cell} />
  } else if (isCallForPaperGithub(cell, headerKey)) {
    return (
      <IconButton value={`${import.meta.env.VITE_DASHBOARD_CALLFORPAPERS_GITHUB_URL}${cell}`} />
    )
  } else if (isDateCell(cell)) {
    content = convertDate(cell)
  } else if (cell === '' || cell === null) {
    content = '-'
  } else {
    content = cell
  }

  return content
}

const Table = ({
  item,
  headers,
  data,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  setRowModal,
  isAccordeon = false,
  checkedRows,
  setCheckedRows,
}: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${item}/${pid}${search}`)
  }

  const handleSort = (header: string) => {
    if (!setSortBy || !setSortOrder) return
    if (sortBy === header) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(header)
      setSortOrder('desc')
    }
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

  return (
    <>
      <table className={`table ${item}`}>
        <thead>
          <tr>
            {isArticleOrAbstracts && !isAccordeon && (
              <th className="checkbox-header">
                <Checkbox
                  isHeader={true}
                  checked={allLoadedChecked}
                  onChange={(checked) => {
                    if (checked) {
                      const newMap: Record<string, boolean> = {}
                      cleanData.forEach((row) => {
                        newMap[String(row[0])] = true
                      })
                      setCheckedRows({ selectAll: true })
                    } else {
                      setCheckedRows({ selectAll: false })
                    }
                  }}
                />{' '}
              </th>
            )}
            {visibleHeaders.map((header, idx) =>
              header === 'status' && isArticle(item) ? (
                articleSteps.map((step) => (
                  <th key={step.key} className="status-header" title={step.label}>
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </th>
                ))
              ) : (
                <th key={header} className={`header ${header}`}>
                  {isUnsortableHeader(header, item) ? (
                    t(`${item}.${header}`)
                  ) : setSortBy && setSortOrder ? (
                    <SortButton
                      active={sortBy === header}
                      order={sortOrder}
                      onClick={() => handleSort(header)}
                      label={t(`${item}.${header}`)}
                    />
                  ) : (
                    t(`${item}.${header}`)
                  )}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {cleanData.map((row, rIdx) => {
            return (
              <tr key={rIdx}>
                {isArticleOrAbstracts && !isAccordeon && (
                  <td>
                    <Checkbox
                      checked={isRowChecked(String(row[0]))}
                      onChange={(checked) => {
                        setCheckedRows((prev) => {
                          const newState = { ...prev }
                          const pid = String(row[0])
                          if (checkedRows.selectAll) {
                            if (checked) {
                              delete newState[pid]
                            } else {
                              newState[pid] = false
                            }
                          } else {
                            if (checked) {
                              newState[pid] = true
                            } else {
                              delete newState[pid]
                            }
                          }

                          return newState
                        })
                      }}
                    />{' '}
                  </td>
                )}
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
                      colSpan={isStep && isArticleItem ? articleSteps.length : 0}
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

                {isAbstractItem && !isAccordeon && (
                  <td className="actions-cell">
                    {setRowModal && (
                      <ActionButton
                        actions={getRowActions(row, setRowModal, t)}
                        active={getRowActions(row, setRowModal, t).length > 0}
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

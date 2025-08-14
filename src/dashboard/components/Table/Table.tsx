import './Table.css'

import { useState } from 'react'
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
import ActionButton from '../Buttons/ActionButton/ActionButton'
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
  setModal,
  isAccordeon = false,
}: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })
  const [checkedRows, setCheckedRows] = useState<{ pid: string; check: boolean }[]>(
    cleanData.map((row) => ({ pid: String(row[0]), check: false })),
  )
  console.log('🚀 ~ file: Table.tsx:79 ~ checkedRows:', checkedRows)
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

  return (
    <>
      <table className={`table ${item}`}>
        <thead>
          <tr>
            <th className="checkbox-header"></th>
            {visibleHeaders.map((header, idx) =>
              header === 'status' && isArticle(item) ? (
                articleSteps.map((step) => (
                  <th key={step.key} className="status-header" title={step.label}>
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </th>
                ))
              ) : (
                <th key={header} className={`header ${header}`}>
                  {isFirstnameHeader(header) ||
                  isLastnameHeader(header) ||
                  ((isCallForPapers(item) || isIssues(item)) &&
                    !isRepositoryHeader(header) &&
                    !isStatusHeader(header)) ? (
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
            const isAbstractItem = isAbstract(item)
            const isArticleItem = isArticle(item)
            const isArticleOrAbstracts = isAbstractItem || isArticleItem

            return (
              <tr key={rIdx}>
                <td>
                  <Checkbox
                    checked={checkedRows[rIdx].check}
                    onChange={(checked: boolean) => {
                      setCheckedRows((prev) =>
                        prev.map((obj, idx) => (idx === rIdx ? { ...obj, check: checked } : obj)),
                      )
                    }}
                  />
                </td>
                {row.map((cell, cIdx) => {
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
                    {setModal && (
                      <ActionButton
                        actions={getRowActions(row, setModal, t)}
                        active={getRowActions(row, setModal, t).length > 0}
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

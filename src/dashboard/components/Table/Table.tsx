import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { renderCellProps, TableProps } from './interface'

import { articleSteps } from '../../utils/constants/article'
import { convertDate } from '../../utils/helpers/convertDate'
import {
  getCleanData,
  getRowActions,
  getVisibleHeaders,
  isAbstract,
  isArticle,
  isCallForPapers,
  isDateCell,
  isIssues,
  isLinkCell,
  isRepositoryHeader,
  isStatus,
  isStatusHeader,
  isStepCell,
  isTitleHeader,
} from '../../utils/helpers/table'
import ActionButton from '../Buttons/ActionButton/ActionButton'
import IconButton from '../Buttons/IconButton/IconButton'
import SortButton from '../Buttons/SortButton/SortButton'
import Status from '../Status/Status'
import Timeline from '../Timeline/Timeline'

import './Table.css'

function renderCell({
  isStep,
  cell,
  headers,
  cIdx,
  isAbstract,
  isArticle,
  isIssues,
}: renderCellProps) {
  let content: React.ReactNode = '-'
  const headerKey = headers[cIdx].toLowerCase().split('.').join(' ')

  if (isStep && isArticle) {
    content = <Timeline steps={articleSteps} currentStatus={cell} />
  } else if (isStatus(cell, headerKey) && (isAbstract || isIssues)) {
    content = <Status value={cell} />
  } else if (isLinkCell(cell)) {
    content = <IconButton value={cell} />
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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(header)
      setSortOrder('asc')
    }
  }

  return (
    <>
      <table className={`table ${item}`}>
        <thead>
          <tr>
            {visibleHeaders.map((header, idx) =>
              header === 'status' && isArticle(item) ? (
                articleSteps.map((step) => (
                  <th key={step.key} className="status-header" title={step.label}>
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </th>
                ))
              ) : (
                <th key={header} className={header}>
                  {!isRepositoryHeader(header) &&
                  !isStatusHeader(header) &&
                  (isCallForPapers(item) || isIssues(item)) ? (
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
            const isIssuesItem = isIssues(item)
            const isArticleOrAbstracts = isAbstractItem || isArticleItem

            return (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => {
                  const headerName = headers[cIdx]
                  const isTitle = isTitleHeader(headerName)
                  const isStep = isStepCell(cell)

                  return (
                    <td
                      key={cIdx}
                      className={headerName}
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
                        isAbstract: isAbstractItem,
                        isArticle: isArticleItem,
                        isIssues: isIssuesItem,
                      })}
                    </td>
                  )
                })}
                <td className="actions-cell">
                  {isAbstractItem && setModal && getRowActions(row, setModal, t).length > 0 && (
                    <ActionButton actions={getRowActions(row, setModal, t)} />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Table

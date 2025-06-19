import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TableProps } from './interface'

import { articleSteps } from '../../constants/article'
import { convertDate } from '../../utils/convertDate'
import { convertLink } from '../../utils/convertLink'
import { convertStatus } from '../../utils/convertStatus'
import { isOrcid } from '../../utils/orcid'
import { getCleanData, getVisibleHeaders } from '../../utils/table'
import SortButton from '../Buttons/SortButton/SortButton'
import Timeline from '../Timeline/Timeline'

import './Table.css'

function renderCell({
  cell,
  headers,
  cIdx,
  isAbstract,
  isArticle,
}: {
  cell: any
  header: string
  headers: string[]
  cIdx: number
  title: string
  isAbstract: boolean
  isArticle: boolean
}) {
  let content: React.ReactNode = '-'
  const headerKey = headers[cIdx].toLowerCase().split('.').join(' ')
  const isStep =
    typeof cell === 'string' && articleSteps.some((step) => step.key === cell.toLowerCase())

  if (isStep && isArticle) {
    content = <Timeline steps={articleSteps} currentStatus={cell} />
  } else if (cell === '' || cell === null) {
    content = '-'
  } else if (typeof cell === 'string' && headerKey === 'status' && isAbstract) {
    content = convertStatus(cell)
  } else if (typeof cell === 'string' && (cell.startsWith('http') || isOrcid(cell))) {
    content = convertLink(cell)
  } else if (typeof cell === 'string' && DateTime.fromISO(cell).isValid) {
    content = convertDate(cell)
  } else {
    content = cell
  }

  return (
    <td key={cIdx} colSpan={isStep ? articleSteps.length : 0} className={headerKey}>
      {content}
    </td>
  )
}

const Table = ({
  title,
  headers,
  data,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = location.search

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${title}/${pid}${search}`)
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
    <table className="table">
      <thead>
        <tr>
          {visibleHeaders.map((header, idx) =>
            header === 'status' && title === 'articles' ? (
              articleSteps.map((step) => (
                <th key={step.key} className="status-header" title={step.label}>
                  <span className="material-symbols-outlined">{step.icon}</span>
                </th>
              ))
            ) : (
              <th key={header} className={header}>
                {header !== 'repository_url' &&
                header !== 'status' &&
                (title === 'callforpapers' || title === 'issues') ? (
                  t(`${title}.${header}`)
                ) : setSortBy && setSortOrder ? (
                  <SortButton
                    active={sortBy === header}
                    order={sortOrder}
                    onClick={() => handleSort(header)}
                    label={t(`${title}.${header}`)}
                  />
                ) : (
                  t(`${title}.${header}`)
                )}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {cleanData.map((row, rIdx) => {
          const isAbstract = title === 'abstracts'
          const isArticle = title === 'articles'
          return (
            <tr
              key={rIdx}
              {...(isAbstract || isArticle
                ? { onClick: () => handleRowClick(String(row[0])), style: { cursor: 'pointer' } }
                : {})}
            >
              {row.map((cell, cIdx) =>
                renderCell({
                  cell,
                  header: headers[cIdx],
                  headers,
                  cIdx,
                  title,
                  isAbstract,
                  isArticle,
                }),
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table

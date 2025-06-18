import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { articleSteps } from '../../constants/article'
import { convertDate } from '../../utils/convertDate'
import { convertLink } from '../../utils/convertLink'
import { getCleanData, getVisibleHeaders } from '../../utils/table'
import SortButton from '../Buttons/SortButton/SortButton'
import Timeline from '../Timeline/Timeline'

import '../Table/Table.css'

const ProgressionTable = ({ title, headers, data, sortBy, sortOrder, setSortBy, setSortOrder }) => {
  const { t } = useTranslation()
  const search = location.search
  const navigate = useNavigate()
  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${title}/${pid}${search}`)
  }

  const handleSort = (header: string) => {
    if (sortBy === header) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(header)
      setSortOrder('asc')
    }
  }

  return (
    <table className="progression table">
      <thead>
        <tr>
          {visibleHeaders.map((header, idx) =>
            header === 'status' ? (
              articleSteps.map((step) => (
                <th key={step.key} className="status-header" title={step.label}>
                  <span className="material-symbols-outlined">{step.icon}</span>
                </th>
              ))
            ) : (
              <th key={header} className={header}>
                {header !== 'repository_url' && header !== 'status' && (
                  <SortButton
                    active={sortBy === header}
                    order={sortOrder}
                    onClick={() => handleSort(header)}
                    label={t(`${title}.${header}`)}
                  />
                )}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {cleanData.map((row, rIdx) => (
          <tr
            key={rIdx}
            onClick={() => handleRowClick(String(row[0]))}
            style={{ cursor: 'pointer' }}
          >
            {row.map((cell, cIdx) => {
              const header = headers[cIdx].toLowerCase().split('.').join(' ')
              let content: React.ReactNode = '-'

              const isStep =
                typeof cell === 'string' &&
                articleSteps.some((step) => step.key === cell.toLowerCase())

              if (isStep) {
                content = <Timeline steps={articleSteps} currentStatus={cell} />
              } else if (typeof cell === 'string' && DateTime.fromISO(cell).isValid) {
                content = convertDate(cell)
              } else if (typeof cell === 'string' && cell.startsWith('http')) {
                content = convertLink(cell)
              } else if (cell === null) {
                content = '-'
              } else {
                content = cell
              }

              return (
                <td key={cIdx} colSpan={isStep ? articleSteps.length : 0} className={`${header}`}>
                  {content}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProgressionTable

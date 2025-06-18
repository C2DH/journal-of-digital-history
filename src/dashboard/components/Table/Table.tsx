import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { convertDate } from '../../utils/convertDate'
import { convertLink } from '../../utils/convertLink'
import { convertStatus } from '../../utils/convertStatus'
import { isOrcid } from '../../utils/orcid'
import { getCleanData, getVisibleHeaders } from '../../utils/table'
import SortButton from '../Buttons/SortButton/SortButton'

import './Table.css'

const Table = ({ title, headers, data, sortBy, sortOrder, setSortBy, setSortOrder }) => {
  const { t } = useTranslation()
  const search = location.search
  const navigate = useNavigate()

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleSort = (header: string) => {
    if (sortBy === header) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(header)
      setSortOrder('asc')
    }
  }

  const handleRowClick = (pid: string) => {
    navigate(`/${title}/${pid}${search}`)
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {visibleHeaders.map((header, idx) => (
            <th key={header} className={`${header}`}>
              {title === 'callforpapers' || title === 'issues' ? (
                t(`${title}.${header}`)
              ) : (
                <SortButton
                  active={sortBy === header}
                  order={sortOrder}
                  onClick={() => handleSort(header)}
                  label={t(`${title}.${header}`)}
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cleanData.map((row, rIdx) => {
          const isAbstract = title === 'abstracts'
          return (
            <tr
              key={rIdx}
              {...(isAbstract
                ? { onClick: () => handleRowClick(String(row[0])), style: { cursor: 'pointer' } }
                : {})}
            >
              {row.map((cell, cIdx) => {
                const header = headers[cIdx].toLowerCase()
                let content: React.ReactNode = '-'

                if (cell === '' || cell === null) {
                  content = '-'
                } else if (typeof cell === 'string' && header === 'status') {
                  /* TODO : change this by the Status component */
                  content = convertStatus(cell)
                } else if (typeof cell === 'string' && (cell.startsWith('http') || isOrcid(cell))) {
                  content = convertLink(cell)
                } else if (typeof cell === 'string' && DateTime.fromISO(cell).isValid) {
                  content = convertDate(cell)
                } else {
                  content = cell
                }

                return (
                  <td key={cIdx} className={`${header}`}>
                    {content}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table

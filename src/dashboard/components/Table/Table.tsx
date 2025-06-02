import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TableProps } from '../../interfaces/table'
import { convertDate } from '../../logic/convertDate'
import { convertLink } from '../../logic/convertLink'
import { convertStatus } from '../../logic/convertStatus'
import { isOrcid } from '../../logic/isOrcid'
import { getCleanData, getVisibleHeaders } from '../../logic/tableUtils'

import './Table.css'

const Table = ({ title, headers, data, onRowClick }: TableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleRowClick = (pid: string) => {
    navigate(`/${title}/${pid}`)
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {visibleHeaders.map((header, idx) => (
            <th key={idx} className={`${header}`}>
              {t(`${title}.${header}`)}
            </th>
          ))}
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
              const header = headers[cIdx].toLowerCase()
              let content: React.ReactNode = '-'

              if (typeof cell === 'string' && header === 'status') {
                content = convertStatus(cell)
              } else if (typeof cell === 'string' && (cell.startsWith('http') || isOrcid(cell))) {
                content = convertLink(cell)
              } else if (typeof cell === 'string' && DateTime.fromISO(cell).isValid) {
                content = convertDate(cell)
              } else if (cell === null) {
                content = '-'
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
        ))}
      </tbody>
    </table>
  )
}

export default Table

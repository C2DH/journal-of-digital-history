import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'

import { TableProps } from '../../interfaces/table'
import { convertDate } from '../../logic/convertDate'
import { convertStatus } from '../../logic/convertStatus'
import { getCleanData, getVisibleHeaders } from '../../logic/tableUtils'

import './Table.css'

const Table = ({ title, headers, data }: TableProps) => {
  const { t } = useTranslation()

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

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
          <tr key={rIdx}>
            {row.map((cell, cIdx) => {
              const header = headers[cIdx].toLowerCase()
              let content: React.ReactNode = '-'

              if (typeof cell === 'string' && header === 'status') {
                content = convertStatus(cell)
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

import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import { TableProps } from '../../interface/table'
import './Table.css'

const statusIcons: Record<string, { icon: string }> = {
  published: { icon: 'check_circle' },
  error: { icon: 'error' },
  draft: { icon: 'error' },
}

const convertDate = (date) => {
  return DateTime.fromISO(date).toFormat('dd MMM yyyy')
}

const convertStatus = (cell: String) => {
  const status = cell.toLowerCase()
  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }

  return (
    <>
      <span
        className={`material-symbols-outlined icon-status ${status}`}
      >{`${iconInfo.icon}`}</span>
      <span>{status} </span>
    </>
  )
}

const Table = ({ title, headers, data }: TableProps) => {
  const { t } = useTranslation()

  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className={`${header}`}>
              {t(`${title}.${header}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rIdx) => (
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
              } else  {
                content = cell
              }

              return <td key={cIdx} className={`${header}`}>{content}</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table

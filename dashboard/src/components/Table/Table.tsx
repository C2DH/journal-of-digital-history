import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import './Table.css'

type TableProps = {
  title: string
  headers: string[]
  data: (string | number)[][]
}

const Table = ({ title, headers, data }: TableProps) => {
  const { t } = useTranslation()

  const convertDate = (date) => {
    return DateTime.fromISO(date).toFormat('dd MMM yyyy')
  }

  return (
    <table className="card-table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{t(`${title}.${header}`)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => (
              <td key={cIdx}>
                {typeof cell === 'string' && DateTime.fromISO(cell).isValid
                  ? convertDate(cell)
                  : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table

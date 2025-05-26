import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'

import { steps } from '../../constants/timeline'
import { TableProps } from '../../interfaces/table'
import { convertDate } from '../../logic/convertDate'
import { convertLink } from '../../logic/convertLink'
import { getCleanData, getVisibleHeaders } from '../../logic/tableUtils'
import Timeline from '../Timeline/Timeline'

import './ProgressionTable.css'
import '../Table/Table.css'

const ProgressionTable = ({ title, headers, data }: TableProps) => {
  const { t } = useTranslation()
  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })
  console.log('🚀 ~ file: ProgressionTable.tsx:18 ~ cleanData:', cleanData)

  return (
    <table className="progression table">
      <thead>
        <tr>
          {visibleHeaders.map((header, idx) =>
            header === 'status' ? (
              steps.map((step) => (
                <th key={step.key} className="status-header" title={step.label}>
                  <span className="material-symbols-outlined">{step.icon}</span>
                </th>
              ))
            ) : (
              <th key={header} className={header}>
                {t(`${title}.${header}`)}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {cleanData.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => {
              let content: React.ReactNode = '-'

              const isStep =
                typeof cell === 'string' && steps.some((step) => step.key === cell.toLowerCase())

              if (isStep) {
                content = <Timeline steps={steps.length} currentStep={cell} />
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
                <td key={cIdx} colSpan={isStep ? steps.length : 0}>
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

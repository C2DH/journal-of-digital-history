import './StatusBadge.css'

import { useTranslation } from 'react-i18next'

import { StatusBadgeProps } from './interface'

const StatusBadge = ({ status, count }: StatusBadgeProps) => {
  const { t } = useTranslation()

  if (count) {
    return (
      <div className="simple-status-container">
        <span className={`status-fancy-badge ${status.toLowerCase()}`}>
          {`${count} ${t(`badge.status.${status.toLowerCase()}`)}`}
        </span>
      </div>
    )
  }

  return (
    <div className="simple-status-container">
      <span className={`status-fancy-badge ${status.toLowerCase()}`}>
        {t(`badge.status.${status.toLowerCase()}`)}
      </span>
    </div>
  )
}

export default StatusBadge

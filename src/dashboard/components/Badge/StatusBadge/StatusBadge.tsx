import './StatusBadge.css'

import { useTranslation } from 'react-i18next'

import { StatusBadgeProps } from './interface'

const StatusBadge = ({ status, count }: StatusBadgeProps) => {
  const { t } = useTranslation()

  return (
    <div className={`simple-status-container`} data-testid="status-badge-id">
      <span className={`status-fancy-badge ${status.toLowerCase()}`}>
        {count
          ? `${count} ${t(`badge.status.${status.toLowerCase()}`)}`
          : t(`badge.status.${status.toLowerCase()}`)}
      </span>
    </div>
  )
}

export default StatusBadge

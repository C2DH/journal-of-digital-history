import './StatusBadge.css'

import { useTranslation } from 'react-i18next'

import { StatusBadgeProps } from './interface'

import { articleStatus } from '../../../utils/constants/article'

const StatusBadge = ({ status, count }: StatusBadgeProps) => {
  const { t } = useTranslation()
  let content: React.ReactNode = '-'

  const icon: React.ReactNode = articleStatus.map((step) => {
    if (step.value === status) return step.icon
  })

  if (count) {
    content = `${count} ${t(`badge.status.${status.toLowerCase()}`)}`
  } else {
    content = (
      <>
        {icon}
        <span>{t(`badge.status.${status.toLowerCase()}`)}</span>
      </>
    )
  }

  return (
    <div className={`simple-status-container`} data-testid="status-badge-id">
      <span className={`status-fancy-badge ${status.toLowerCase()}`}>{content}</span>
    </div>
  )
}

export default StatusBadge

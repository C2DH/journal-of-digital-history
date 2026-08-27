import './Status.css'

import { Cancel, CheckCircle, Error } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { StatusProps } from './interface'

import { articleStatus } from '../../utils/constants/article'
import StatusBadge from '../Badge/StatusBadge/StatusBadge'
import { statusIcons } from './constant'

const Status = ({ value }: StatusProps) => {
  const { t } = useTranslation()
  const status = value.toLowerCase()

  const iconInfo = statusIcons[status] ?? { icon: 'cancel', color: 'gray' }

  const hasBadgeStatus = articleStatus.some((item) => item.value === value)
  if (hasBadgeStatus) {
    return <StatusBadge status={value} />
  }

  const iconMap = {
    check_circle: CheckCircle,
    error: Error,
    cancel: Cancel,
  }

  const IconComponent = iconMap[iconInfo.icon as keyof typeof iconMap] ?? Cancel

  return (
    <span className="status-cell value">
      <IconComponent className={`icon-status ${status}`} />
      <span>{t(`status.${status}`)}</span>
    </span>
  )
}

export default Status

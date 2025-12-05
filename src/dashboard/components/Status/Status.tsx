import './Status.css'

import { useTranslation } from 'react-i18next'

import { StatusProps } from './interface'

import { articleSteps } from '../../utils/constants/article'
import { statusIcons } from './constant'

const Status = ({ value, isArticle }: StatusProps) => {
  const { t } = useTranslation()
  const status = value.toLowerCase()

  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }

  if (isArticle) {
    const icon = articleSteps.find((step) => step.key === status.toLowerCase())

    return <span className="material-symbols-outlined icon-status">{icon?.icon}</span>
  }

  return (
    <span className="status-cell">
      <span className={`material-symbols-outlined icon-status ${status}`}>{iconInfo.icon}</span>
      <span>{t(`status.${status}`)}</span>
    </span>
  )
}

export default Status

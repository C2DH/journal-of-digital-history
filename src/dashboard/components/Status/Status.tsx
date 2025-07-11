import './Status.css'

import { useTranslation } from 'react-i18next'

import { StatusProps } from './interface'

import { statusIcons } from './constant'

const Status = ({ value }: StatusProps) => {
  const { t } = useTranslation()
  const status = value.toLowerCase()

  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }

  return (
    <span className="status-cell">
      <span className={`material-symbols-outlined icon-status ${status}`}>{iconInfo.icon}</span>
      <span>{t(`status.${status}`)}</span>
    </span>
  )
}

export default Status

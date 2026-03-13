import './Status.css'

import Icon from '@mui/material/Icon'
import { useTranslation } from 'react-i18next'

import { StatusProps } from './interface'

import { statusIcons } from './constant'

const Status = ({ value }: StatusProps) => {
  const { t } = useTranslation()
  const status = value.toLowerCase()

  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }
  return (
    <span className="status-cell value">
      <Icon className={`icon-status ${status}`}>{iconInfo.icon} </Icon>
      <span>{t(`status.${status}`)}</span>
    </span>
  )
}

export default Status

import './Status.css'

import { Cancel, CheckCircle, Error } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { StatusProps } from './interface'

import { statusIcons } from './constant'

const Status = ({ value }: StatusProps) => {
  const { t } = useTranslation()
  const status = value.toLowerCase()

  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }

  if (iconInfo.icon === 'check_circle') {
    return (
      <span className="status-cell value">
        <CheckCircle className={` icon-status ${status}`} />
        <span>{t(`status.${status}`)}</span>
      </span>
    )
  } else if (iconInfo.icon === 'error') {
    return (
      <span className="status-cell value">
        <Error className={` icon-status ${status}`} />
        <span>{t(`status.${status}`)}</span>
      </span>
    )
  } else if (iconInfo.icon === 'cancel') {
    return (
      <span className="status-cell value">
        <Cancel className={` icon-status ${status}`} />
        <span>{t(`status.${status}`)}</span>
      </span>
    )
  }
}

export default Status

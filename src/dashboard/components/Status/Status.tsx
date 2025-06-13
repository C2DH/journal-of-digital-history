import { statusIcons } from './constant'
import { StatusProps } from './interface'

const Status = ({ value }: StatusProps) => {
  const status = value.toLowerCase()
  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }

  return (
    <span className="status-cell">
      <span className={`material-symbols-outlined icon-status ${status}`}>{iconInfo.icon}</span>
      <span>{status}</span>
    </span>
  )
}

export default Status

import { statusIcons } from '../constants/statusIcon'

export const convertStatus = (cell: string) => {
  const status = cell.toLowerCase()
  const iconInfo = statusIcons[status] || { icon: 'help', color: 'gray' }

  return (
    <span className="status-cell">
      <span
        className={`material-symbols-outlined icon-status ${status}`}
      >{`${iconInfo.icon}`}</span>
      <span>{status} </span>
    </span>
  )
}

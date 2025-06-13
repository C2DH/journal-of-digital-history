import { statusIcons } from '../components/Status/constant'

/**
 * Converts a status string into a JSX element displaying a corresponding icon and status text.
 *
 * @param cell - The status string to convert (case-insensitive).
 * @returns A JSX element containing the status icon and status text.
 */
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

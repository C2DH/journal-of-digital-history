import './StatusLog.css'

import { CheckCircle, Error } from '@mui/icons-material'

import { StatusLogProps } from './interface'

const StatusLog = ({ logs }: StatusLogProps) => {
  return (
    <ul className="log-status-list">
      {logs.map((log) => {
        return (
          <li key={log.status}>
            <div className="icon-container">
              <span className="log-status-icon">
                {logs.indexOf(log) === 0 ? <Error /> : <CheckCircle />}
              </span>
            </div>
            <div className="round-icon"></div>
            <span className="log-label">{log.status.toUpperCase()}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default StatusLog

import './StatusLog.css'

import { Cancel, CheckCircle, Error } from '@mui/icons-material'

import { StatusLogProps } from './interface'

import { articleSteps } from '../../utils/constants/article'
import { convertDate } from '../../utils/helpers/date'

const StatusLog = ({ logs }: StatusLogProps) => {
  return (
    <ul className="log-status-list">
      {logs.map((log) => {
        return (
          <>
            <li key={log.status}>
              <span className="status-icon" title={log.status.toUpperCase()}>
                {articleSteps.find((step) => step.key === log.status.toLowerCase())?.icon ?? (
                  <Cancel />
                )}
              </span>
              <div className="icon-container">
                <span className="log-status-icon">
                  {logs.indexOf(log) === 0 ? (
                    <Error className="log-warning-icon" />
                  ) : (
                    <CheckCircle className="log-check-icon" />
                  )}
                </span>
              </div>
              <div className="round-icon"></div>

              <div className="log-label">
                <span className="log-label-date"> done {convertDate(log.date)}</span>
                <span className="log-label-user"> by {log.user}</span>
              </div>
            </li>
          </>
        )
      })}
    </ul>
  )
}

export default StatusLog

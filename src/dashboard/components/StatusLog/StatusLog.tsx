import './StatusLog.css'

import { Cancel, CheckCircle, Error } from '@mui/icons-material'

import { StatusLogProps } from './interface'

import { articleSteps } from '../../utils/constants/article'
import { convertDate } from '../../utils/helpers/date'

const StatusLog = ({ logs }: StatusLogProps) => {
  return (
    <ul className="log-status-list">
      {logs.map((log) => {
        const step = articleSteps.find((step) => step.key === log.status.toLowerCase())

        return (
          <>
            <li key={log.status}>
              <span className="status-icon" title={log.status.toUpperCase()}>
                {step?.icon ?? <Cancel />}
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
                <span className="log-label-user">
                  {' '}
                  <b>{step?.label ?? 'Rejected'} </b>
                  by {log.user}
                </span>
                <span className="log-label-date">{convertDate(log.date)}</span>
              </div>
            </li>
          </>
        )
      })}
    </ul>
  )
}

export default StatusLog

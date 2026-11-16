import './StatusLog.css'

import { Cancel, CheckCircle, Error } from '@mui/icons-material'
import { DateTime } from 'luxon'
import { ReactNode } from 'react'

import { StatusLogProps } from './interface'

import { abstractStatus } from '../../utils/constants/abstract'
import { articleSteps } from '../../utils/constants/article'
import { convertDate } from '../../utils/helpers/date'

const IconSelector = ({ log, logs, isArticle, isAbstract }) => {
  let icon: ReactNode
  if (isArticle) {
    return (
      <span className="log-status-icon">
        {logs.indexOf(logs) === 0
          ? (icon = <Error className="log-warning-icon" />)
          : (icon = <CheckCircle className="log-check-icon" />)}
      </span>
    )
  }

  if (isAbstract) {
    if (log.status === 'Waiting for action' || log.status === 'SUSPENDED') {
      return (icon = <Error className="log-warning-icon" />)
    } else if (log.status === 'ABANDONED' || log.status === 'DECLINED') {
      return (icon = <Cancel className="log-error-icon" />)
    } else if (log.status === 'ACCEPTED' || log.status === 'SUBMITTED') {
      return (icon = <CheckCircle className="log-check-icon" />)
    }
  }

  return <span className="log-status-icon">{icon}</span>
}

const StatusLog = ({ logs, isArticle, isAbstract }: StatusLogProps) => {
  const logsInversed = [...logs].reverse() // reverse on a copy of the array
  // const logsInversed = logs

  if (isAbstract && logs.length === 1) {
    logsInversed.unshift({
      date: String(DateTime.now()),
      status: 'Waiting for action',
      user: '',
    })
  }

  return (
    <ul className="log-status-list">
      {logsInversed.map((log) => {
        const articleStep = articleSteps.find((step) => step.key === log.status.toLowerCase())
        const abstractStep = abstractStatus.find((status) => status.value === log.status)

        return (
          <>
            <li key={log.status}>
              {
                <span className="status-icon" title={log.status.toUpperCase()}>
                  {isArticle && (articleStep?.icon ?? <Cancel />)}
                  {isAbstract && <div style={{ width: '24px' }}></div>}
                </span>
              }
              <div className="icon-container">
                <span className="log-status-icon">
                  <IconSelector
                    log={log}
                    logs={logsInversed}
                    isArticle={isArticle}
                    isAbstract={isAbstract}
                  />
                </span>
              </div>
              <div className="round-icon"></div>

              <div className="log-label">
                <span className="log-label-user">
                  {' '}
                  <b>
                    {isArticle && (articleStep?.label ?? 'Rejected')}
                    {(isAbstract && abstractStep?.label) ?? 'Waiting for action'}
                  </b>
                  {log.user && ` by ${log.user}`}
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

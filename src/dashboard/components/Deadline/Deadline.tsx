import './Deadline.css'

import { DateTime } from 'luxon'

import { DeadlineProps } from './interface'

const getDeadlineFormat = (deadline: string) => {
  return DateTime.fromISO(deadline).toFormat('dd MMM yyyy')
}

const getNumberOfDays = (deadline: string) => {
  return Math.ceil(DateTime.fromISO(deadline).diff(DateTime.now(), 'days').days)
}

const Deadline = ({ cfpTitle, deadlineAbstract, deadlineArticle }: DeadlineProps) => {
  let days = 0
  let message = 'days left'
  const now = DateTime.now()

  const abstractDays = getNumberOfDays(deadlineAbstract)
  const articleDays = getNumberOfDays(deadlineArticle)
  const abstractDate = getDeadlineFormat(deadlineAbstract)
  const articleDate = getDeadlineFormat(deadlineArticle)

  if (now < DateTime.fromISO(deadlineAbstract)) {
    days = abstractDays
  } else if (now < DateTime.fromISO(deadlineArticle)) {
    days = articleDays
  }

  if (abstractDays > 365 * 2) {
    days = 0
    message = 'open ended'
  }

  return (
    <div className="deadline-counter">
      <span className="material-symbols-outlined deadline-logo">campaign</span>
      <div className="deadline-counter-info">
        <span className="deadline-counter-cfp-title" title={cfpTitle}>
          {cfpTitle}{' '}
        </span>
        <span className="deadline-counter-days">
          {days === 0 ? '' : days} {message}
        </span>
        <p className="deadline-counter-dates">
          {' '}
          {DateTime.fromISO(deadlineAbstract).startOf('day') > DateTime.now().startOf('day')
            ? `Abstracts for ${abstractDate}`
            : `Articles for ${articleDate}`}
        </p>
      </div>
    </div>
  )
}

export default Deadline

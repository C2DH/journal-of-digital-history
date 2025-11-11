import { DateTime } from 'luxon'
import './Deadline.css'

import { DeadlineProps } from './interface'

const Deadline = ({ cfpTitle, days, deadlineAbstract, deadlineArticle }: DeadlineProps) => {
  const deadlineAbstractDate = DateTime.fromISO(deadlineAbstract).toFormat('dd MMM yyyy')
  const deadlineArticleDate = DateTime.fromISO(deadlineArticle).toFormat('dd MMM yyyy')

  return (
    <div className="deadline-counter">
      <span className="material-symbols-outlined deadline-logo">campaign</span>
      <div className="deadline-counter-info">
        <span className="deadline-counter-cfp-title" title={cfpTitle}>
          {cfpTitle}{' '}
        </span>
        <span className="deadline-counter-days">
          {days > 365 ? 'open ended' : `${days} days left`}
        </span>
        <p className="deadline-counter-dates">
          {' '}
          {DateTime.fromISO(deadlineAbstract) > DateTime.now()
            ? `Articles for ${deadlineArticleDate}`
            : `Abstracts for ${deadlineAbstractDate}`}
        </p>
      </div>
    </div>
  )
}

export default Deadline

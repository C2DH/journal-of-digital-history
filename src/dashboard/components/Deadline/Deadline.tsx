import './Deadline.css'

import { DateTime } from 'luxon'

import { CounterProps, DeadlineProps } from './interface'

const getDeadlineFormat = (deadline: string) => {
  return DateTime.fromISO(deadline).toFormat('dd MMM yyyy')
}

const getNumberOfDays = (deadline: string) => {
  return Math.ceil(DateTime.fromISO(deadline).startOf('day').diff(DateTime.now(), 'days').days)
}

const getDealineMessages = ({ deadlineAbstract, deadlineArticle }: DeadlineProps) => {
  let days = 0
  let message = 'days left'

  const now = DateTime.now()

  const abstractDays = getNumberOfDays(deadlineAbstract)
  const articleDays = getNumberOfDays(deadlineArticle)
  const abstractDate = getDeadlineFormat(deadlineAbstract)
  const articleDate = getDeadlineFormat(deadlineArticle)
  let messageDate = `Article deadline : ${articleDate}`

  if (DateTime.fromISO(deadlineAbstract).startOf('day') > DateTime.now().startOf('day')) {
    messageDate = `Abstract deadline : ${abstractDate}`
  }

  if (now < DateTime.fromISO(deadlineAbstract)) {
    days = abstractDays
  } else if (now < DateTime.fromISO(deadlineArticle)) {
    days = articleDays
  }

  if (abstractDays > 365 * 2) {
    days = 0
    message = 'open ended'
  }

  return { days, message, messageDate }
}

const Deadline = ({ title, deadlineAbstract, deadlineArticle }: CounterProps) => {
  let days = 0
  let message = ''
  let messageDate = ''

  if (deadlineAbstract && deadlineArticle) {
    ;({ days, message, messageDate } = getDealineMessages({ deadlineAbstract, deadlineArticle }))
  }

  return (
    <div className="counter">
      <span className="material-symbols-outlined campaign logo">campaign</span>
      <div className="counter-info">
        <span className="counter-title" title={title}>
          {title}
        </span>
        <span className="counter-days">
          {days === 0 ? '' : days} {message}
        </span>
        <p className="counter-dates">{messageDate}</p>
      </div>
    </div>
  )
}

export default Deadline

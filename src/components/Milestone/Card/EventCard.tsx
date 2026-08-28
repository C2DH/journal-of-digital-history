import './EventCard.css'

import parse from 'html-react-parser'
import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'

const EventCard = ({ event, manyEvents }) => {
  const navigate = useNavigate()
  const typeClean = event.type.replace(/\s/g, '')
  const hasAnchor = event.title.includes('</a>')
  let text: string = ''

  if (!hasAnchor && manyEvents) {
    text = event.title.substring(0, 30) + '...'
  } else {
    text = event.title
  }

  const handleClick = () => {
    if (event.pid) {
      navigate(`/en/article/${event.pid}`)
    }
  }

  return (
    <div
      className={`event-card Dimension_${typeClean} ${hasAnchor ? 'hasAnchor' : ''}`}
      onClick={handleClick}
    >
      <div className={`event-content Dimension_${typeClean} ${hasAnchor ? 'hasAnchor' : ''}`}>
        <div className="event-text" title={event.title}>
          {parse(text)}
        </div>
        <span className="event-date">
          {DateTime.fromISO(event.date).toFormat('d LLL yyyy')}
          {event.issue ? ` • Issue n.${event.issue}` : ''}
        </span>
      </div>
    </div>
  )
}

export default EventCard

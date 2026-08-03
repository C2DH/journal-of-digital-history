import './EventCard.css'

import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'

const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const typeClean = event.type.replace(/\s/g, '')
  const hasAnchor = event.title.includes('</a>')

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
        <div className={`event-text`} dangerouslySetInnerHTML={{ __html: event.title }}></div>
        <span className="event-date">
          {DateTime.fromISO(event.date).toFormat('d LLL yyyy')}
          {event.issue ? ` • Issue n.${event.issue}` : ''}
        </span>
      </div>
    </div>
  )
}

export default EventCard

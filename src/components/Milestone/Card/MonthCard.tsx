import './MonthCard.css'

import EventCard from './EventCard'

const MonthCard = ({ title, events }) => {
  const noEvent = events.length === 0
  let monthName = title

  if (noEvent) {
    monthName = title.substring(0, 3)
  }

  return (
    <div className={`month-container ${noEvent ? 'disabled' : ''}`}>
      <span className={`month-title ${noEvent ? 'disabled' : ''}`}>{monthName}</span>
      <div className={`month-card ${noEvent ? 'disabled' : ''}`}>
        <div className="event-list">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MonthCard

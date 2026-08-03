import './MonthCard.css'

import EventCard from './EventCard'

const MonthCard = ({ title, events }) => {
  return (
    <div className="month-container">
      <span className="month-title">{title}</span>
      <div className="month-card">
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

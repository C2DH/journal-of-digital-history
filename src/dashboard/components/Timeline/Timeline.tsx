import { TimelineProps } from './interface'

import { getTimelineSteps } from '../../utils/helpers/getTimelineStep'
import './Timeline.css'

const Timeline = ({ steps, currentStatus }: TimelineProps) => {
  const visuals = getTimelineSteps(currentStatus, steps)

  return (
    <div className="timeline-container">
      <div className="timeline-line" />
      <ul className="timeline-list">
        {visuals.map((visual, idx) => (
          <li key={idx} className="timeline-item">
            <span className={`material-symbols-outlined ${visual.colorClass}`}>{visual.icon}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Timeline

import './Timeline.css'

import Icon from '@mui/material/Icon'

import { TimelineProps } from './interface'

import { articleStatus } from '../../utils/constants/article'
import { getTimelineSteps } from '../../utils/helpers/getTimelineStep'

const Timeline = ({ steps, currentStatus }: TimelineProps) => {
  const visuals = getTimelineSteps(currentStatus, steps)
  const status = articleStatus.find((item) => item.value === currentStatus)?.label || 'Unknown'

  return (
    <>
      <div className="timeline-container">
        <div className="timeline-line" />
        <ul className="timeline-list">
          {visuals.map((visual, idx) => (
            <li key={idx} className="timeline-item">
              <Icon baseClassName="material-symbols-outlined" className={`${visual.colorClass}`}>
                {visual.icon}
              </Icon>
            </li>
          ))}
        </ul>
      </div>
      <div className="simple-status-container">
        <span className={`status-fancy-badge ${currentStatus.toLowerCase()}`}>{status}</span>
      </div>
    </>
  )
}

export default Timeline

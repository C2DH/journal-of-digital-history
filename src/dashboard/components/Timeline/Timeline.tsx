import './Timeline.css'

import { useState } from 'react'

import { TimelineProps } from './interface'

import { useIsMobile } from '../../hooks/useIsMobile'
import { getTimelineSteps } from '../../utils/helpers/timeline'
import StatusBadge from '../Badge/StatusBadge/StatusBadge'

const Timeline = ({ steps, currentStatus }: TimelineProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const visuals = getTimelineSteps(currentStatus, steps)

  useIsMobile(setIsMobile)

  return (
    <>
      {!isMobile && (
        <div className="timeline-container">
          <div className="timeline-line" />
          <ul className="timeline-list">
            {visuals.map((visual, idx) => (
              <li key={idx} className={`timeline-item ${visual.colorClass}`}>
                {visual.icon}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isMobile && <StatusBadge status={currentStatus || 'unknown'} />}
    </>
  )
}

export default Timeline

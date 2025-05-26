import React from 'react'
import './Timeline.css'

// interface TimelineProps {
//   steps: string[]
//   currentStep: string // 0-based index of the last validated step
// }

const Timeline = ({ steps, currentStep }) => {
  return (
    <div className="timeline-container">
      <div className="timeline-line" />
      <ul className="timeline-list">
        {Array.from({ length: steps }).map((_, idx) => (
          <li key={idx} className="timeline-item">
            <div className={`timeline-icon-container ${idx <= currentStep ? 'validated' : ''}`}>
              <span className="material-symbols-outlined">
                {idx < currentStep
                  ? 'check_circle'
                  : idx === currentStep
                  ? 'radio_button_checked'
                  : 'radio_button_unchecked'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Timeline

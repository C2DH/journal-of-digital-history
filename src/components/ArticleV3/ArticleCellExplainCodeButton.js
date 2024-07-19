import { Brain, BrainWarning, MagicWand } from 'iconoir-react'
import React from 'react'
import './ArticleCellExplainCodeButton.css'

export const StatusIdle = 'idle'
export const StatusScheduled = 'scheduled'
export const StatusExecuting = 'executing'
export const StatusSuccess = 'success'
export const StatusStopped = 'stopped'
export const StatusError = 'error'
export const StatusDisabled = 'disabled'
export const StatusStopping = 'stopping'
export const StatusBeforeExecuting = 'beforeExecuting'

export const AvailableStatuses = [StatusIdle, StatusExecuting, StatusSuccess, StatusError]

const StatusIcons = {
  [StatusIdle]: MagicWand,
  [StatusExecuting]: MagicWand,
  [StatusSuccess]: Brain,
  [StatusError]: BrainWarning,
}
const StatusLabels = {
  [StatusIdle]: 'Explain code',
  [StatusExecuting]: 'Almost thinking ...',
  [StatusSuccess]: 'Explain again?',
  [StatusError]: 'Error',
}

const ArticleCellExplainCodeButton = ({
  status = StatusIdle,
  disabled = false,
  debug = false,
  className = '',
  onClick = () => {},
}) => {
  const Component = StatusIcons[status]
  const label = StatusLabels[status]
  return (
    <div className={`ArticleCellExplainCodeButton ${status} ${className}`}>
      <button
        className="btn btn-outline-white btn-sm d-flex align-items-center"
        onClick={onClick}
        disabled={disabled}
      >
        <div className="ArticleCellExplainCodeButton__iconWrapper">
          <Component height={16} width={16} />

          <div className="ArticleCellExplainCodeButton__iconArc"></div>
        </div>
        <span className="ms-2">{label}</span>
      </button>
      {debug && <span className="ml-2">{status}</span>}
    </div>
  )
}

export default ArticleCellExplainCodeButton

import { BrainWarning, ElectronicsChip, MagicWand, PauseSolid } from 'iconoir-react'
import React from 'react'
import './ArticleCellExplainCodeButton.css'
import CircularLoading from '../CircularLoading'
import ButtonInflatable from '../ButtonInflatable'

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
  [StatusExecuting]: PauseSolid,
  [StatusSuccess]: ElectronicsChip,
  [StatusError]: BrainWarning,
}
const StatusLabels = {
  [StatusIdle]: 'Explain code',
  [StatusExecuting]: 'Thinking …',
  [StatusSuccess]: 'Explain code',
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
      <ButtonInflatable
        label={label}
        className="btn btn-outline-white btn-sm d-flex align-items-center"
        onClick={onClick}
        disabled={disabled}
      >
        <div className="ArticleCellExplainCodeButton__iconWrapper me-2">
          <Component height={16} width={16} />
          <CircularLoading width={24} height={24} strokeWidth={2} />
        </div>
      </ButtonInflatable>
      {debug && <span className="ml-2">{status}</span>}
    </div>
  )
}

export default ArticleCellExplainCodeButton

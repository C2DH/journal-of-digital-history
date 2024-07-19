import { Check, EyeClosed, OnePointCircle, PlaySolid, Xmark } from 'iconoir-react'
import React from 'react'
import './ArticleCellRunCodeButton.css'

export const StatusIdle = 'idle'
export const StatusScheduled = 'scheduled'
export const StatusExecuting = 'executing'
export const StatusSuccess = 'success'
export const StatusError = 'error'
export const StatusDisabled = 'disabled'

export const AvailableStatuses = [
  StatusIdle,
  StatusScheduled,
  StatusExecuting,
  StatusSuccess,
  StatusError,
  StatusDisabled,
]

const StatusIcons = {
  [StatusIdle]: PlaySolid,
  [StatusExecuting]: OnePointCircle,
  [StatusSuccess]: PlaySolid,
  [StatusError]: Xmark,
  [StatusScheduled]: PlaySolid,
  [StatusDisabled]: EyeClosed,
}

const StatusLabels = {
  [StatusIdle]: 'Run code',
  [StatusExecuting]: 'Running',
  [StatusSuccess]: 'Run code', // when success, you can run again ...
  [StatusError]: 'Error',
  [StatusScheduled]: '...',
  [StatusDisabled]: 'Disabled',
}

const ArticleCellRunCodeButton = ({ status = StatusIdle, elapsed = '10 ms' }) => {
  const disabled = [StatusDisabled, StatusError, StatusScheduled].includes(status)
  const Component = StatusIcons[status]
  const label = StatusLabels[status]
  return (
    <div className={`ArticleCellRunCodeButton ${status} d-flex align-items-center`}>
      <button
        disabled={disabled}
        className="btn btn-sm btn-outline-white d-flex align-items-center"
      >
        <div className="ArticleCellRunCodeButton__iconWrapper me-2">
          <Component height={16} width={16} />
        </div>
        {label}
      </button>
      {status === StatusSuccess && (
        <div className="text-white ms-2 text-center">
          <Check />
          <div>{elapsed}</div>
        </div>
      )}
      <div className="ms-2 ArticleCellRunCodeButton__status">{status}</div>
    </div>
  )
}

export default ArticleCellRunCodeButton

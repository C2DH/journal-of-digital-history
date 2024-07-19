import { Check, Cube, EyeClosed, Minus, OnePointCircle, PlaySolid, Xmark } from 'iconoir-react'
import React, { useEffect } from 'react'
import './ArticleCellRunCodeButton.css'

export const StatusIdle = 'idle'
export const StatusScheduled = 'scheduled'
export const StatusExecuting = 'executing'
export const StatusSuccess = 'success'
export const StatusError = 'error'
export const StatusDisabled = 'disabled'
export const StatusBeforeExecuting = 'beforeExecuting'

export const AvailableStatuses = [
  StatusIdle,
  StatusScheduled,
  StatusExecuting,
  StatusSuccess,
  StatusError,
  StatusDisabled,
  StatusBeforeExecuting, // this is internal status when
]

const StatusIcons = {
  [StatusIdle]: PlaySolid,
  [StatusExecuting]: OnePointCircle,
  [StatusSuccess]: PlaySolid,
  [StatusError]: Xmark,
  [StatusScheduled]: PlaySolid,
  [StatusDisabled]: EyeClosed,
  [StatusBeforeExecuting]: Cube,
}

const StatusLabels = {
  [StatusIdle]: 'Run code',
  [StatusExecuting]: 'Running',
  [StatusSuccess]: 'Run code', // when success, you can run again ...
  [StatusError]: 'Error',
  [StatusScheduled]: '...',
  [StatusDisabled]: 'Disabled',
  [StatusBeforeExecuting]: '...',
}

const ArticleCellRunCodeButton = ({ status = StatusIdle, debug = false, onClick = () => {} }) => {
  const disabled = [StatusDisabled, StatusError, StatusScheduled].includes(status)
  const Component = StatusIcons[status]
  const label = StatusLabels[status]
  const timerRef = React.useRef(null)
  const elapsedTimeRef = React.useRef(0)
  const elapsedTimeElementRef = React.useRef(null)

  useEffect(() => {
    if (status === StatusExecuting) {
      elapsedTimeRef.current = 0
      timerRef.current = setInterval(() => {
        elapsedTimeRef.current += 100
        elapsedTimeElementRef.current.innerText = `${
          Math.round(elapsedTimeRef.current / 100) / 10
        } s`
      }, 100)
    } else {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [status])

  return (
    <div className={`ArticleCellRunCodeButton ${status} d-flex align-items-center`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="btn btn-sm btn-outline-white d-flex align-items-center"
      >
        <div className="ArticleCellRunCodeButton__iconWrapper me-2">
          <Component height={16} width={16} />
        </div>
        {label}
      </button>
      <div className="ArticleCellRunCodeButton__timer ms-2">
        {status === StatusSuccess ? <Check /> : <Minus />}
        <div ref={elapsedTimeElementRef}>0.0 s</div>
      </div>
      {debug && <div className="ms-2 ArticleCellRunCodeButton__status">{status}</div>}
    </div>
  )
}

export default ArticleCellRunCodeButton

import './Toast.css'

import parse from 'html-react-parser'
import { useRef } from 'react'

import CheckCircle from '../../../assets/icons/CheckCircle'
import Error from '../../../assets/icons/Error'
import { useNotificationStore } from '../../store'

const Toast = () => {
  const { notification, isVisible } = useNotificationStore()
  const type = notification?.type
  const message = notification?.message
  const submessage = notification?.submessage

  const toastRef = useRef<HTMLDivElement>(null)

  if (!isVisible || !message) return null

  return (
    <div ref={toastRef} className={`toast-container ${type} toast-progress-animate`}>
      {type === 'success' || type === 'info' ? (
        <CheckCircle className="toast-icon" data-testid={`toast-icon-check`} />
      ) : (
        <Error className="toast-icon" data-testid={`toast-icon-error`} />
      )}
      <div className="toast-content">
        <div className="toast-message">{message}</div>
        <div className="toast-submessage">{parse(submessage || '')}</div>
      </div>
    </div>
  )
}

export default Toast

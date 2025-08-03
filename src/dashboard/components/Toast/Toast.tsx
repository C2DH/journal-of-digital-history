import './Toast.css'

import { ToastProps } from './interface'

import CheckCircleIcon from '../../../assets/icons/CheckCircleIcon'

const Toast = ({ open, message, type = 'info', onClose }: ToastProps) => {
  if (!open) return null

  return (
    <div className={`toast-container ${type}`}>
      <CheckCircleIcon className="toast-check-icon" />
      <div className="toast-content">
        <div className="toast-message">{message}</div>
        <div className="toast-submessage">
          Take a look <a href="">here</a> →
        </div>
      </div>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  )
}

export default Toast

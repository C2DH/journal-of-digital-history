import './Toast.css'

import parse from 'html-react-parser'
import { useEffect, useRef } from 'react'

import { ToastProps } from './interface'

import CheckCircle from '../../../assets/icons/CheckCircle'
import Error from '../../../assets/icons/Error'

const Toast = ({ open, message, submessage, type = 'info', onClose }: ToastProps) => {
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      if (onClose) onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [open, onClose])

  if (!open) return null

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

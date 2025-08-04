import './Toast.css'

import parse from 'html-react-parser'
import { useEffect, useRef } from 'react'

import { ToastProps } from './interface'

import CheckCircleIcon from '../../../assets/icons/CheckCircleIcon'

const Toast = ({ open, message, submessage, type = 'info', onClose }: ToastProps) => {
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      if (onClose) onClose()
    }, 500)
    return () => clearTimeout(timer)
  }, [open, onClose])

  if (!open) return null

  return (
    <div ref={toastRef} className={`toast-container ${type}`}>
      <CheckCircleIcon className="toast-check-icon" />
      <div className="toast-content">
        <div className="toast-message">{message}</div>
        <div className="toast-submessage">{parse(submessage || '')}</div>
      </div>
    </div>
  )
}

export default Toast

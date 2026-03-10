import { useNotificationStore } from '../../store'

const { setNotification } = useNotificationStore()

export const notify = (
  type: 'success' | 'error' | 'warning',
  message: string,
  submessage?: string,
  delay?: number,
) => {
  const notification = { type, message, submessage }
  if (delay) {
    setTimeout(() => setNotification(notification), delay)
  } else {
    setNotification(notification)
  }
}

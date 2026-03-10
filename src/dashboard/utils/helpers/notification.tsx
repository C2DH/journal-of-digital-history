import { useItemsStore, useNotificationStore } from '../../store'

export const notify = (
  type: 'success' | 'error' | 'warning',
  message: string,
  submessage?: string,
  delay?: number,
) => {
  const { setNotification } = useNotificationStore.getState()
  const { fetchItems } = useItemsStore.getState()

  const notification = { type, message, submessage }

  if (delay) {
    setTimeout(() => setNotification(notification), delay)
  } else {
    setNotification(notification)
  }
  fetchItems(true)
}

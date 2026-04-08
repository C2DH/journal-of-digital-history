import { useItemsStore, useItemStore, useNotificationStore } from '../../store'

export const notify = (
  type: 'success' | 'error' | 'warning',
  message: string,
  submessage?: string,
  delay?: number,
  pid?: string,
) => {
  const { setNotification } = useNotificationStore.getState()
  const { fetchItems } = useItemsStore.getState()
  const { fetchItem } = useItemStore.getState()

  const notification = { type, message, submessage }

  if (delay) {
    setTimeout(() => setNotification(notification), delay)
  } else {
    setNotification(notification)
  }

  if (pid) {
    fetchItem(pid, 'abstracts')
    fetchItem(pid, 'articles')
  } else {
    fetchItems(true)
  }
}

import { useItemsStore, useItemStore, useNotificationStore } from '../../store'

export const notify = (
  type: 'success' | 'error' | 'warning',
  message: string,
  submessage?: string,
  delay: number = 0,
  pid?: string,
  endpoint?: string,
) => {
  const { setNotification } = useNotificationStore.getState()
  const { fetchItems } = useItemsStore.getState()
  const { fetchItem } = useItemStore.getState()

  const notification = { type, message, submessage }

  setNotification(notification, delay)

  if (type != 'success') return

  if (pid) {
    fetchItem(pid, endpoint ?? 'articles')
  } else {
    fetchItems(true)
  }
}

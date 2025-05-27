import { DateTime } from 'luxon'

export const convertDate = (date) => {
  return DateTime.fromISO(date).toFormat('dd MMM yyyy')
}

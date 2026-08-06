import { DateTime } from 'luxon'

export const getMonths = (month: number, year: number, cursor: number) => {
  const start = DateTime.fromObject({ year: Number(year), month }).minus({ months: cursor })

  return Array.from({ length: month }, (_, i) => {
    const date = start.minus({ months: month - 1 - i }).startOf('month')

    return {
      key: date.toFormat('yyyy-MM'),
      title: date.toFormat('LLL yyyy'),
    }
  })
}

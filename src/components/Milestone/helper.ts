import { DateTime } from 'luxon'

export const getMonths = (timeline: any, month: number) => {
  if (!timeline) return []
  return Object.keys(timeline)
    .map(Number)
    .sort((a, b) => b - a)
    .flatMap((year) => {
      const start = DateTime.fromObject({ year: Number(year), month })

      return Array.from({ length: month }, (_, i) => {
        const date = start.minus({ months: month - 1 - i }).startOf('month')

        return {
          key: date.toFormat('yyyy-MM'),
          year: String(date.year),
          title: date.toFormat('LLL yyyy'),
        }
      })
    })
}

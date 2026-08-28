import { DateTime } from 'luxon'

export const getMonths = (timeline: any, month: number) => {
  if (!timeline) return []

  const years = Object.keys(timeline)
    .map(Number)
    .sort((a, b) => a - b) // oldest year first, most recent year last (rightmost)

  return years.flatMap((year) => {
    const start = DateTime.fromObject({ year, month }).endOf('year')

    return Array.from({ length: month }, (_, i) => {
      const date = start.minus({ months: month - 1 - i }).startOf('month')
      // i=0 -> Jan, i=11 -> Dec: ascending, so the most recent month ends up on the far right

      return {
        key: date.toFormat('yyyy-MM'),
        year: String(date.year),
        title: date.toFormat('LLL yyyy'),
      }
    })
  })
}

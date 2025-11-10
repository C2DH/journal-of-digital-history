export const abstractStatus = [
  { key: 1, value: 'PUBLISHED', label: 'Published' },
  { key: 2, value: 'ACCEPTED', label: 'Accepted' },
  { key: 3, value: 'SUBMITTED', label: 'Submitted' },
  { key: 4, value: 'SUSPENDED', label: 'Suspended' },
  { key: 5, value: 'ABANDONED', label: 'Abandoned' },
  { key: 6, value: 'DECLINED', label: 'Declined' },
]

export const abstractSeriesKey = abstractStatus.map((item) => {
  return { dataKey: item.label, label: item.label, stack: 'unique' }
})

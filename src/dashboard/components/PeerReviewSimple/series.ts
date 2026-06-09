import { BarSeriesType } from '@mui/x-charts/models'

export const series: Omit<BarSeriesType, 'type'>[] = [
  {
    dataKey: 'ontime',
    label: 'In progress',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: (item) => (item.value ? String(item.value) : null),
  },
  {
    dataKey: 'delay',
    label: 'Delayed',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: (item) => (item.value ? String(item.value) : null),
  },
  {
    dataKey: 'declined',
    label: 'Declined',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: (item) => (item.value ? String(item.value) : null),
  },
]

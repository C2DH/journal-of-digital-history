import { BarSeriesType } from '@mui/x-charts/models'

export const series: Omit<BarSeriesType, 'type'>[] = [
  {
    dataKey: 'assign',
    id: 'assign',
    label: 'Assign reviewer',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: 'value',
  },
  {
    dataKey: 'awaiting',
    id: 'awaiting',
    label: 'Awaiting Reviewer Response',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: 'value',
  },
  {
    dataKey: 'review',
    id: 'review',
    label: 'Review in progress',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: 'value',
  },
  {
    dataKey: 'reviewer',
    id: 'reviewer',
    label: 'Reviewer decision',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: 'value',
  },
  {
    dataKey: 'revising',
    id: 'revising',
    label: 'Author revising',
    layout: 'horizontal',
    stack: 'stack',
    highlightScope: {
      highlight: 'item',
      fade: 'global',
    },
    barLabel: 'value',
  },
]

import { BarSeriesType } from '@mui/x-charts/models'

export const dataset = [
  [1, 3, 2, 0, 3, 'R1'],
  [0, 3, 2, 1, 0, 'R2'],
  [1, 0, 0, 0, 0, 'R3+'],
].map(([assign, awaiting, review, reviewer, revising, order]) => ({
  assign,
  awaiting,
  review,
  reviewer,
  revising,
  order,
}))

export const datasetTitlesAndAuthors = [
  {
    key: 'assign-R1',
    articles: [
      {
        authors: 'John Doe',
        title: 'The Digital Turn',
        substatus: ['thanked', 'thanked', 'overdue'],
      },
      {
        authors: 'Anna Reynolds',
        title: 'Decolonizing Digital Archives',
        substatus: ['thanked'],
      },
      {
        authors: 'Mark Liu',
        title: 'Networks of Knowledge',
        substatus: ['overdue', 'thanked'],
      },
      {
        authors: 'Sara Kim',
        title: 'Crowdsourced Metadata Practices',
        substatus: ['thanked', 'thanked'],
      },
    ],
  },
  {
    key: 'assign-R2',
    articles: [
      { authors: 'Bob Brown', title: 'Open Access Futures' },
      { authors: 'Carol White', title: 'Digital Archives' },
    ],
  },
  {
    key: 'assign-R3+',
    articles: [{ authors: 'Dan Black', title: 'AI and History' }],
  },
  {
    key: 'awaiting-R1',
    articles: [
      { authors: 'Eve Green', title: 'Crowdsourcing the Past' },
      { authors: 'Jane Doe', title: 'History in the Cloud' },
      { authors: 'Alice Smith', title: 'Peer Review Revolution' },
    ],
  },
  {
    key: 'awaiting-R2',
    articles: [
      { authors: 'Frank Blue', title: 'Digital Storytelling' },
      { authors: 'Grace Red', title: 'Metadata Matters' },
      { authors: 'Grace Red', title: 'Metadata Matters' },
    ],
  },
  {
    key: 'review-R1',
    articles: [
      { authors: 'Helen Yellow', title: 'Visualization in History' },
      { authors: 'Helen Yellow', title: 'Visualization in History' },
    ],
  },
  {
    key: 'review-R2',
    articles: [
      { authors: 'Helen Yellow', title: 'Visualization in History' },
      { authors: 'Helen Yellow', title: 'Visualization in History' },
    ],
  },
  {
    key: 'reviewer-R2',
    articles: [{ authors: 'Ian Violet', title: 'Peer Review Automation' }],
  },
  {
    key: 'revising-R1',
    articles: [
      { authors: 'Jack Orange', title: 'Revisioning the Journal' },
      { authors: 'Karen Pink', title: 'Collaborative Editing' },
      { authors: 'Karen Pink', title: 'Collaborative Editing' },
    ],
  },
  {
    key: 'assign-R3',
    articles: [{ authors: 'Leo Indigo', title: 'Long Tail of Peer Review' }],
  },
]

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

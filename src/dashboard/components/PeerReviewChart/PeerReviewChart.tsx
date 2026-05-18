import './PeerReviewChart.css'

import { BarChart, BarChartProps } from '@mui/x-charts'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorsPeerReviewChart } from '../../styles/theme'
import SmallCard from '../SmallCard/SmallCard'
import SmallTable from '../SmallTable/SmallTable'

type ArticleInPeerReview = {
  authors: string
  title: string
}
type ItemInPeerReview = {
  key: string
  articles: ArticleInPeerReview[]
}

const PeerReviewChart = () => {
  const { t } = useTranslation()
  const [label, setLabel] = useState('Default')
  const [round, setRound] = useState<number>(4)
  const [data, setData] = useState<ItemInPeerReview | undefined>(undefined)

  const dataset = [
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

  const datasetTitlesAndAuthors = [
    {
      key: 'assign-R1',
      articles: [{ authors: 'John Doe', title: 'The Digital Turn' }],
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

  useEffect(() => {
    const item = datasetTitlesAndAuthors.find((item) => item.key === `${label}-R${round}`)
    setData(item)
  }, [label, round])

  function getChartSettings(): BarChartProps {
    return {
      dataset,
      series: [
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
        },
      ],
      height: 300,
      width: 500,
      margin: { left: 0, top: 0 },
      xAxis: [
        {
          position: 'none',
        },
      ],
      yAxis: [
        {
          dataKey: 'order',
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: {
            fill: 'var(--color-deep-blue)',
            fontWeight: 900,
            fontSize: 16,
            fontFamily: "'DM Sans', sans-serif !important",
          },
        },
      ],
      slotProps: {
        legend: {
          direction: 'horizontal',
          position: { vertical: 'bottom', horizontal: 'center' },
          sx: {
            fontSize: 14,
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--color-deep-blue)',
          },
        },
        tooltip: { trigger: 'item' },
      },
      colors: colorsPeerReviewChart,
      barLabel: 'value',
    }
  }

  return (
    <>
      <SmallCard className="home-peerreviewchart chart">
        <h3>{t('KPI.peerReviewChart.title')}</h3>
        <BarChart
          sx={{
            '.MuiBarElement-root': {
              strokeWidth: 2,
              stroke: 'white',
            },
          }}
          onItemClick={(event, d) => {
            setLabel(String(d.seriesId))
            setRound(Number(d.dataIndex + 1))
          }}
          {...getChartSettings()}
        />
      </SmallCard>
      {data != undefined && (
        <SmallCard className="home-peerreviewchart-next-table chart">
          <h2 className="home-peerreviewchart-next-table-title">
            {`R${round} - ${t(`KPI.peerReviewChart.${label}`)}`}
          </h2>
          {data ? (
            <SmallTable
              item="articles"
              headers={['title', 'authors']}
              data={data.articles}
            ></SmallTable>
          ) : (
            ''
          )}
        </SmallCard>
      )}
    </>
  )
}

export default PeerReviewChart

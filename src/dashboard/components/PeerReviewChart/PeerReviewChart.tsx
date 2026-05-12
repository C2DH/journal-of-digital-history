import { BarChart, BarChartProps } from '@mui/x-charts'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorsPeerReviewChart } from '../../styles/theme'
import SmallCard from '../SmallCard/SmallCard'

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
      articles: [
        {
          authors: 'John Doe',
          title: 'Test',
        },
        {
          authors: 'Jane Doe',
          title: 'Test2',
        },
      ],
    },
  ]

  useEffect(() => {
    const item = datasetTitlesAndAuthors.find((item) => item.key === `${label}-R${round}`)
    setData(item)
  }, [label, round])

  function getChartSettings(): Partial<BarChartProps> {
    return {
      dataset,
      height: 300,
      width: 600,
      slotProps: {
        legend: {
          direction: 'horizontal',
          position: { vertical: 'bottom', horizontal: 'center' },
          sx: {
            fontSize: 16,
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
    <div>
      <SmallCard className="home-peerreviewchart chart">
        <h3>{t('KPI.peerReviewChart.title')}</h3>
        <BarChart
          series={[
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
              label: 'Author revising',
              layout: 'horizontal',
              stack: 'stack',
              highlightScope: {
                highlight: 'item',
                fade: 'global',
              },
            },
          ]}
          margin={{ left: 0 }}
          xAxis={[
            {
              position: 'none',
            },
          ]}
          yAxis={[
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
          ]}
          sx={{
            '.MuiBarElement-root': {
              strokeWidth: 2,
              stroke: 'white',
            },
          }}
          onItemClick={(event, d) => {
            console.log('🚀 ~ file: PeerReviewChart.tsx:143 ~ d:', d)
            setLabel(String(d.seriesId))
            setRound(Number(d.dataIndex + 1))
          }}
          borderRadius={12}
          {...getChartSettings()}
        />
      </SmallCard>
      <SmallCard className="home-peerreviewchart next-table chart">
        <h3>
          {label}-R{round}
        </h3>
        {data
          ? data.articles.map((a) => {
              return (
                <p>
                  {a.title} {a.authors}
                </p>
              )
            })
          : ''}
      </SmallCard>
    </div>
  )
}

export default PeerReviewChart

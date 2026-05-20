import './PeerReviewChart.css'

import { BarChart, BarChartProps } from '@mui/x-charts'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorsPeerReviewChart } from '../../styles/theme'
import SmallCard from '../SmallCard/SmallCard'
import SmallTable from '../SmallTable/SmallTable'
import { dataset, datasetTitlesAndAuthors, series } from './constant'
import Legend from './Legend'

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

  useEffect(() => {
    const item = datasetTitlesAndAuthors.find((item) => item.key === `${label}-R${round}`)
    setData(item)
  }, [label, round])

  function getChartSettings(): BarChartProps {
    return {
      dataset: dataset,
      series: series,
      height: 200,
      width: 400,
      margin: { left: 0, top: 0, right: 30, bottom: 10 },
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
        tooltip: { trigger: 'item' },
      },
      colors: colorsPeerReviewChart,
      barLabel: 'value',
    }
  }

  return (
    <>
      <SmallCard className="home-peerreviewchart chart">
        <h2>{t('KPI.peerReviewChart.title')}</h2>
        <BarChart
          sx={{
            '.MuiBarElement-root': {
              strokeWidth: 2,
              stroke: 'white',
            },
            '.MuiBarLabel-root': {
              fill: 'white',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
          onItemClick={(event, d) => {
            setLabel(String(d.seriesId))
            setRound(Number(d.dataIndex + 1))
          }}
          {...getChartSettings()}
          hideLegend
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, marginLeft: 50 }}
        >
          <Legend />
        </div>
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

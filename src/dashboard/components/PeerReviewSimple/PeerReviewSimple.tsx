import { BarChart, BarChartProps } from '@mui/x-charts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { colorPeerReviewSimpleChart } from '../../styles/theme'
import { getPeerReviewArticlesTiming } from '../../utils/api/api'
import Legend from '../Legend/Legend'
import SmallCard from '../SmallCard/SmallCard'
import { series } from './series'

const PeerReviewSimple = () => {
  const { t } = useTranslation()

  const getPeerReviewArticlesWithTiming = async () => {
    const data = await getPeerReviewArticlesTiming()
    const dataWithoutNull = data.filter(
      (item) => item.ontime != 0 || item.delay != 0 || item.declined != 0,
    )
    return dataWithoutNull
  }

  const { data } = useSuspenseQuery({
    queryKey: ['peerReviewSimpleData'],
    queryFn: getPeerReviewArticlesWithTiming,
    staleTime: 0,
  })

  function getChartSettings(): BarChartProps {
    return {
      dataset: data,
      height: 200,
      margin: { left: 0, right: 0, bottom: 20 },
      series: series,
      slotProps: {
        tooltip: { trigger: 'item' },
      },
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
      colors: colorPeerReviewSimpleChart,
    }
  }

  return (
    <>
      <SmallCard className="home-peerreviewchart-simple chart">
        <h2>{t('KPI.peerReviewChart.simple.title')}</h2>
        {data.length > 0 && (
          <BarChart
            sx={{
              '.MuiBarElement-root': {
                strokeWidth: 2,
                stroke: 'white',
              },
              '.MuiBarChart-label': {
                fill: 'white',
                fontWeight: 700,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
            {...getChartSettings()}
            hideLegend
            onItemClick={(event, d) => {
              if (d.seriesId === 'declined') {
                window.open(`${import.meta.env.VITE_OJS_DASHBOARD}submissions#archive`)
              }
              window.open(`${import.meta.env.VITE_OJS_DASHBOARD}submissions#active`)
            }}
          />
        )}
        <Legend series={series} colors={colorPeerReviewSimpleChart} />
      </SmallCard>
    </>
  )
}

export default PeerReviewSimple

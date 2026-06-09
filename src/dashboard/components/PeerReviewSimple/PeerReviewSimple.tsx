import { BarChart, BarChartProps } from '@mui/x-charts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { colorPeerReviewSimpleChart } from '../../styles/theme'
import { getPeerReviewArticlesTiming } from '../../utils/api/api'
import SmallCard from '../SmallCard/SmallCard'

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
      height: 150,
      margin: { left: 0, bottom: 50 },
      series: [
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
      ],
      slotProps: {
        legend: {
          direction: 'horizontal',
          position: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          sx: {
            fontSize: 16,
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--color-deep-blue)',
          },
        },
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
          />
        )}
      </SmallCard>
    </>
  )
}

export default PeerReviewSimple

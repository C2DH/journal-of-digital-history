import { BarChart, BarChartProps } from '@mui/x-charts'
import { useTranslation } from 'react-i18next'

import SmallCard from '../SmallCard/SmallCard'

const PeerReviewSimple = () => {
  const { t } = useTranslation()

  const dataset = [
    [8, 1, 'R1'],
    [8, 0, 'R2'],
    [1, 0, 'R3+'],
  ].map(([ontime, delay, order]) => ({
    ontime,
    delay,
    order,
  }))

  function getChartSettings(): BarChartProps {
    return {
      dataset,
      width: 300,
      series: [
        {
          dataKey: 'ontime',
          label: 'On Time',
          layout: 'horizontal',
          stack: 'stack',
          highlightScope: {
            highlight: 'item',
            fade: 'global',
          },
        },
        {
          dataKey: 'delay',
          label: 'Overdue',
          layout: 'horizontal',
          stack: 'stack',
          highlightScope: {
            highlight: 'item',
            fade: 'global',
          },
        },
      ],
      slotProps: {
        legend: {
          direction: 'horizontal',
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
      margin: {
        bottom: 80,
      },
    }
  }

  return (
    <>
      <SmallCard className="home-peerreviewchart-simple chart">
        <h2>{t('KPI.peerReviewChart.simple.title')}</h2>
        <BarChart
          sx={{
            '.MuiBarElement-root': {
              strokeWidth: 2,
              stroke: 'white',
            },
          }}
          {...getChartSettings()}
        />
      </SmallCard>
    </>
  )
}

export default PeerReviewSimple

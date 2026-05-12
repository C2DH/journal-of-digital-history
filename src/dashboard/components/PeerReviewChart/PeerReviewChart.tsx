import { BarChart, BarChartProps } from '@mui/x-charts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorsPeerReviewChart } from '../../styles/theme'
import SmallCard from '../SmallCard/SmallCard'

const PeerReviewChart = () => {
  const { t } = useTranslation()
  const [label, setLabel] = useState('Default')

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
            setLabel(String(d.seriesId))
          }}
          borderRadius={12}
          {...getChartSettings()}
        />
      </SmallCard>
      <SmallCard className="home-peerreviewchart next-table chart">
        <h3>{label}</h3>
      </SmallCard>
    </div>
  )
}

export default PeerReviewChart

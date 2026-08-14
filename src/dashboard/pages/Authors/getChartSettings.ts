import { BarChartProps } from '@mui/x-charts'
import { PieChartProps } from '@mui/x-charts/PieChart'

import { colorsAuthors } from '../../styles/theme'

export function getBarChartSettings(): Omit<BarChartProps, 'series'> {
  return {
    width: 350,
    height: 400,
    margin: { bottom: 60 },
    slotProps: {
      tooltip: { trigger: 'item' },
    },
    xAxis: [
      {
        dataKey: 'label',
        disableLine: true,
        disableTicks: true,
        tickLabelStyle: {
          fill: 'var(--color-deep-blue)',
          fontWeight: 600,
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
        },
        categoryGapRatio: 0.6,
      },
    ],
    yAxis: [
      {
        position: 'none',
      },
    ],
    colors: colorsAuthors,
    sx: {
      '.MuiBarChart-label ': {
        fontSize: 15,
        fontFamily: 'DM Sans, sans-serif',
        fill: 'var(--color-deep-blue)',
        fontWeight: 700,
      },
    },
  }
}

export function getPieChartSettings(): Omit<PieChartProps, 'series'> {
  return {
    height: 200,
    colors: colorsAuthors,
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
    },
    sx: {
      '.MuiChartsLegend-root': {
        marginTop: '40px',
        width: { xs: '100%', lg: '70%', xl: '200px' },
      },
      '.MuiPieChart-arcLabel': {
        fill: 'white',
        fontWeight: 600,
        fontSize: 14,
        fontFamily: 'DM Sans, sans-serif',
      },
    },
  }
}

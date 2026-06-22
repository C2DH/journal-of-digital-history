import { PieChart } from '@mui/x-charts/PieChart'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { colorsPieChart } from '../../styles/theme'
import { articlePieChart } from '../../utils/constants/article'
import SmallCard from '../SmallCard/SmallCard'
import { fetchPieChartData } from './fetch'

const CustomPieChart = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data } = useSuspenseQuery({
    queryKey: ['pieChartData'],
    queryFn: fetchPieChartData,
  })

  const articlesCounts = Array.isArray(data) ? data : []

  const handleSliceClick = (event: any, index: any) => {
    const status = articlePieChart.find((status) => status.key === index.dataIndex)
    if (!status) {
      console.warn('Unknown status for dataIndex:', index?.dataIndex)
      return
    }
    navigate({
      pathname: `/articles`,
      search: `?status=${encodeURIComponent(status.value)}`,
    })
  }

  return (
    <SmallCard className="home-piechart chart">
      <h3>{t('KPI.pieChart.title')}</h3>
      {articlesCounts.length > 0 && (
        <PieChart
          series={[
            {
              innerRadius: 30,
              outerRadius: 100,
              data: articlesCounts,
              highlightScope: { fade: 'global', highlight: 'item' },
              arcLabel: (item) => (item.value != 0 ? `${item.value}` : ''),
            },
          ]}
          colors={colorsPieChart}
          onItemClick={handleSliceClick}
          width={200}
          height={200}
          slotProps={{
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
          }}
          sx={{
            '.MuiChartsLegend-root': {
              marginTop: '30px',
              width: { xs: '100%', lg: '100%', xl: '200px' },
            },
            '.MuiPieChart-arcLabel': {
              fill: 'white',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
      )}
    </SmallCard>
  )
}

export default CustomPieChart

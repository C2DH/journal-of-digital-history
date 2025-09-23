import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { colorsPieChart } from '../../styles/theme'
import { getArticlesByStatus } from '../../utils/api/api'
import { articlePieChart } from '../../utils/constants/article'
import SmallCard from '../SmallCard/SmallCard'

const CustomPieChart = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [articlesCounts, setArticleCounts] = useState<Array<{ label: string; value: number }>>([])

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

  const getArticles = async () => {
    try {
      const counts = await Promise.all(
        articlePieChart.map(async (status) => {
          const res = await getArticlesByStatus(status.value)
          return {
            label: status.label,
            value: res.count || 0,
          }
        }),
      )
      setArticleCounts(counts)
    } catch (error) {
      console.error('Error Fetching count of articles by status:', error)
    }
  }

  useEffect(() => {
    getArticles()
  }, [])

  return (
    <SmallCard className="home-piechart">
      <h3>{t('KPI.pieChart.title')}</h3>
      {articlesCounts.length > 0 && (
        <PieChart
          series={[
            {
              innerRadius: 50,
              outerRadius: 100,
              data: articlesCounts,
              highlightScope: { fade: 'global', highlight: 'item' },
              arcLabel: 'value',
            },
          ]}
          colors={colorsPieChart}
          onItemClick={handleSliceClick}
          width={200}
          height={200}
          slotProps={{
            legend: {
              sx: {
                fontSize: 16,
                fontFamily: 'DM Sans, sans-serif',
                color: 'var(--color-deep-blue)',
              },
            },
          }}
        />
      )}
    </SmallCard>
  )
}

export default CustomPieChart

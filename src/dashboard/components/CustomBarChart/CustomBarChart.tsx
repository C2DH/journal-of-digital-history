import './CustomBarChart.css'

import { BarChart } from '@mui/x-charts/BarChart'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { colorsPieChart } from '../../styles/theme'
import { getArticlesByStatus } from '../../utils/api/api'
import { articlePieChart } from '../../utils/constants/article'
import SmallCard from '../SmallCard/SmallCard'

const CustomBarChart = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const data = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]
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
    } catch (error) {
      console.error('Error - Fetching count of articles by status for each issue:', error)
    }
  }

  useEffect(() => {
    getArticles()
  }, [])

  return (
    <SmallCard className="home-barchart chart">
      <h3 className="barchart-title">{t('KPI.barChart.title')}</h3>
      <p>{t('KPI.barChart.description')}</p>
      {data.length > 0 && (
        <BarChart
          series={data}
          colors={colorsPieChart}
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

export default CustomBarChart

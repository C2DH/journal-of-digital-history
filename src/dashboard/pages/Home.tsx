import '../styles/pages/Home.css'
import '../styles/pages/pages.css'

import { createTheme } from '@mui/system'
import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router'

import SmallCard from '../components/SmallCard/SmallCard'
import { getArticlesByStatus } from '../utils/api/api'
import { articlePieChart } from '../utils/constants/article'

const theme = createTheme({
  palette: {
    primary: {
      dark: '#4527a0',
      main: '#6366F1',
      light: '#b39ddb',
    },
    secondary: {
      dark: '#00695c',
      main: '#2DD4BF',
      light: '#80cbc4',
    },
    published: {
      dark: '#37474f',
      main: '#607d8b',
      light: '#E0E0E0',
    },
  },
})

const colorsPieChart = [
  theme.palette.primary.main,
  theme.palette.primary.dark,
  theme.palette.primary.light,
  theme.palette.secondary.main,
]

const Home = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <div className="home-grid">
        <SmallCard className="home-piechart">
          <h3>Publication stages</h3>
          {articlesCounts.length > 0 && (
            <PieChart
              series={[
                {
                  innerRadius: 50,
                  outerRadius: 100,
                  data: articlesCounts,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 0, additionalRadius: -10, color: 'gray' },
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
      </div>
      <Outlet />
    </div>
  )
}

export default Home

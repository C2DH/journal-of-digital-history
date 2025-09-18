import '../styles/pages/pages.css'

import { createTheme } from '@mui/system'
import { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel'
import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router'

import SmallCard from '../components/SmallCard/SmallCard'
import { useFilterBarStore } from '../store'
import { getArticlesByStatus } from '../utils/api/api'
import { articlePieChart } from '../utils/constants/article'

const theme = createTheme({
  palette: {
    primary: {
      main: 'var(--color-primary)',
    },
    secondary: {
      main: 'var(--color-deep-blue)',
    },
    error: {
      main: 'var(--color-error)',
    },
    warning: {
      main: 'var(--color-warning',
    },
    info: {
      main: 'var(--color-accent)',
    },
    success: {
      main: 'var(--color-success)',
    },
  },
})

function SVGStar({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        className={className}
        d="M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z"
        fill={color}
      />
    </svg>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setFilter } = useFilterBarStore()

  const [articlesCounts, setArticleCounts] = useState<Array<{ label: string; value: number }>>([])

  const handleSliceClick = (event: any, index: any) => {
    const status = articlePieChart.find((status) => status.key === index.dataIndex)
    if (!status) {
      console.warn('Unknown status for dataIndex:', index?.dataIndex)
      return
    }
    setFilter('status', status.value)
    navigate(`/articles`)
  }

  const getArticles = async () => {
    try {
      const counts = await Promise.all(
        articlePieChart.map(async (status) => {
          const res = await getArticlesByStatus(status.value)
          return {
            label: status.label,
            value: res.count || 0,
            color: theme.palette[status.color as keyof typeof theme.palette].main,
            labelMarkType: SVGStar,
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
      <SmallCard>
        <PieChart
          series={[
            {
              data: articlesCounts,
              // arcLabel: (item) => (
              //   <div className="material-symbols-outlined ">{`${item.value}`}</div>
              // ),
            },
          ]}
          onItemClick={handleSliceClick}
          width={400}
          height={400}
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
      </SmallCard>

      <Outlet />
    </div>
  )
}

export default Home

import './CustomBarChart.css'

import { BarChart } from '@mui/x-charts/BarChart'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useIssuesStore } from '../../store'
import { colorsPieChart } from '../../styles/theme'
import { getArticlesByStatusAndIssues } from '../../utils/api/api'
import { articlePieChart } from '../../utils/constants/article'
import { Issue } from '../../utils/types'
import SmallCard from '../SmallCard/SmallCard'

interface StatusNumber {
  [label: string]: number
}

type ArticlesByIssues = StatusNumber & {
  issue: string
}

type StatusCount = {
  data: number[]
  label: string
  stack: string
}

const CustomBarChart = async () => {
  const { t } = useTranslation()
  const { fetchIssues, data: issuesFromStore } = useIssuesStore()
  const [articlesByIssues, setArticlesByIssue] = useState<Array<ArticlesByIssues>>([])

  const getArticles = async () => {
    try {
      await fetchIssues()
      const issues = useIssuesStore.getState().data

      const counts = await Promise.all(
        issues.map(async (issue: Issue) => {
          // Start with the base object
          const baseObj: ArticlesByIssues = { issue: issue.pid } as ArticlesByIssues

          // Add the status counts
          for (const status of articlePieChart) {
            const res = await getArticlesByStatusAndIssues(issue.id, status.value)
            baseObj[status.label] = res.count || 0
          }

          return baseObj
        }),
      )
      console.log('🚀 ~ file: CustomBarChart.tsx:39 ~ counts:', counts)
      setArticlesByIssue(counts)
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
      {articlesByIssues.length > 0 && (
        <BarChart
          series={articlesByIssues}
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

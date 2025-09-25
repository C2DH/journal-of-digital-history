import './CustomBarChart.css'

import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useIssuesStore } from '../../store'
import { colorsBarChart } from '../../styles/theme'
import { getArticlesByStatusAndIssues } from '../../utils/api/api'
import { articlePieChart } from '../../utils/constants/article'
import { Issue } from '../../utils/types'
import SmallCard from '../SmallCard/SmallCard'

type StatusCount = {
  data: number[]
  label: string
  stack: string
}

const CustomBarChart = () => {
  const { t } = useTranslation()
  const { fetchIssues, data: issuesFromStore } = useIssuesStore()
  const [articlesByIssues, setArticlesByIssues] = useState<Array<StatusCount>>([])
  const [issueLabels, setIssueLabels] = useState<string[]>([])

  const getArticles = async () => {
    try {
      await fetchIssues()
      const issues = useIssuesStore.getState().data

      const labels = issues.map((issue: Issue) => issue.pid)

      setIssueLabels(labels)

      const counts = await Promise.all(
        articlePieChart.map(async (status) => {
          const list: StatusCount = { data: [], stack: 'unique', label: status.label }
          const results = await Promise.all(
            issues.map(async (issue: Issue) => {
              const res = await getArticlesByStatusAndIssues(issue.id, status.value)
              return res.count || 0
            }),
          )
          list.data = results
          return list
        }),
      )
      setArticlesByIssues(counts)
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
          colors={colorsBarChart}
          width={400}
          height={400}
          hideLegend
          borderRadius={15}
          xAxis={[
            {
              id: 'issues',
              data: issueLabels,
              scaleType: 'band',
              disableTicks: true,
              disableLine: true,
              categoryGapRatio: 0.7,
            },
          ]}
          yAxis={[{ width: 30, tickNumber: 5, disableTicks: true, disableLine: true }]}
          sx={(theme) => ({
            [`.${axisClasses.root}`]: {
              [`.${axisClasses.tickLabel}`]: {
                fill: 'var(--color-gray)',
                fontFamily: "'DM Sans', sans-serif !important",
              },
            },
          })}
        />
      )}
    </SmallCard>
  )
}

export default CustomBarChart

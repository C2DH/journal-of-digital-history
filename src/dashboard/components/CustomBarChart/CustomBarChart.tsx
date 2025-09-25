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

type StatusCount = {
  data: number[]
  label: string
  stack: string
}

const CustomBarChart = () => {
  const { t } = useTranslation()
  const { fetchIssues, data: issuesFromStore } = useIssuesStore()
  const [articlesByIssues, setArticlesByIssues] = useState<Array<StatusCount>>([])
  const getArticles = async () => {
    try {
      await fetchIssues()
      const issues = useIssuesStore.getState().data

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
          colors={colorsPieChart}
          width={200}
          height={200}
          hideLegend={true}
          borderRadius={5}
        />
      )}
    </SmallCard>
  )
}

export default CustomBarChart

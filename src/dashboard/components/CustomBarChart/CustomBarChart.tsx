import './CustomBarChart.css'

import { BarChart, barLabelClasses } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsByStatus } from './interface'

import { useCallForPapersStore, useIssuesStore } from '../../store'
import { colorsBarChart } from '../../styles/theme'
import { getAbstractsByCallForPapers, getArticlesByStatusAndIssues } from '../../utils/api/api'
import { abstractStatus } from '../../utils/constants/abstract'
import { articlePieChart } from '../../utils/constants/article'
import { APIResponseObject, Callforpaper, Issue } from '../../utils/types'
import SmallCard from '../SmallCard/SmallCard'

const FlipButton = ({ isArticle, onClick }) => {
  return (
    <button className="flip-button material-symbols-outlined" onClick={onClick}>
      {isArticle ? 'draft' : 'description'}
    </button>
  )
}

const CustomBarChart = () => {
  const { t } = useTranslation()
  const [isArticle, setIsArticle] = useState(true)

  const { fetchIssues, data: issuesFromStore } = useIssuesStore()
  const { fetchCallForPapers, data: callforpapersFromStore } = useCallForPapersStore()
  const [itemByStatus, setItemByStatus] = useState<Array<ItemsByStatus>>([])
  const [itemLabel, setItemLabels] = useState<string[]>([])

  const getItems = async (isArticle: boolean) => {
    try {
      await fetchCallForPapers(false)
      await fetchIssues(false)
      const issues = useIssuesStore.getState().data
      const callforpapers = useCallForPapersStore.getState().data

      let labels: string[] = []

      if (isArticle) {
        labels = issues.map((issue: Issue) => issue.name)
      } else {
        labels = callforpapers.map((cfp: Callforpaper) => cfp.title)
      }
      setItemLabels(labels)

      const counts = await Promise.all(
        (isArticle ? articlePieChart : abstractStatus).map(async (status) => {
          const list: ItemsByStatus = { data: [], stack: 'unique', label: status.label }
          const results = await Promise.all(
            issues.map(async (issue: Issue) => {
              let res: APIResponseObject = {
                count: 0,
                next: null,
                previous: null,
                results: [],
              }
              if (isArticle) {
                res = await getArticlesByStatusAndIssues(issue.id, status.value)
              } else {
                res = await getAbstractsByCallForPapers(issue.id, status.value)
              }
              return res.count || 0
            }),
          )
          list.data = results
          return list
        }),
      )
      setItemByStatus(counts)
    } catch (error) {
      console.error('Error - Fetching count of articles by status for each issue:', error)
    }
  }
  const handleClick = () => {
    setIsArticle(!isArticle)
  }

  useEffect(() => {
    getItems(isArticle)
  }, [isArticle])

  return (
    <SmallCard className="home-barchart chart">
      <div className="barchart-header">
        <div className="barchart-header-text">
          <h3 className="barchart-title">
            {t(`KPI.barChart.${isArticle ? 'article' : 'abstract'}.title`)}
          </h3>
          <p>{t(`KPI.barChart.${isArticle ? 'article' : 'abstract'}.description`)}</p>
        </div>
        <FlipButton isArticle={isArticle} onClick={() => handleClick()} />
      </div>
      {itemByStatus.length > 0 && (
        <BarChart
          series={itemByStatus}
          colors={colorsBarChart}
          width={400}
          height={400}
          hideLegend
          // barLabel="value"
          borderRadius={20}
          margin={{ bottom: 10 }}
          xAxis={[
            {
              id: 'issues',
              data: itemLabel,
              scaleType: 'band',
              categoryGapRatio: 0.5,
              disableTicks: true,
              disableLine: true,
              height: 80,
              tickLabelStyle: {
                angle: -50,
                fontSize: 10,
                textAnchor: 'end',
              },
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
            [`.${barLabelClasses.root}`]: {
              fill: 'var(--color-deep-blue)',
              fontSize: 12,
            },
          })}
        />
      )}
    </SmallCard>
  )
}

export default CustomBarChart

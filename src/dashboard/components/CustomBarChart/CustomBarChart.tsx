import './CustomBarChart.css'

import { BarChart, barLabelClasses } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsByStatus } from './interface'

import { useCallForPapersStore, useIssuesStore } from '../../store'
import { colorsBarChartAbstract, colorsBarChartArticle } from '../../styles/theme'
import {
  getAbstractsByStatusAndCallForPapers,
  getArticlesByStatusAndIssues,
} from '../../utils/api/api'
import { abstractStatus } from '../../utils/constants/abstract'
import { articleBarChart } from '../../utils/constants/article'
import { APIResponseObject, Callforpaper, Issue } from '../../utils/types'
import Button from '../Buttons/Button/Button'
import Loading from '../Loading/Loading'
import SmallCard from '../SmallCard/SmallCard'

const CustomBarChart = () => {
  const { t } = useTranslation()
  const [isArticle, setIsArticle] = useState(true)

  const { fetchIssues } = useIssuesStore()
  const { fetchCallForPapers } = useCallForPapersStore()

  const [articleSeries, setArticleSeries] = useState<Array<ItemsByStatus>>([])
  const [articleLabels, setArticleLabels] = useState<string[]>([])

  const [abstractSeries, setAbstractSeries] = useState<Array<ItemsByStatus>>([])
  const [abstractLabels, setAbstractLabels] = useState<string[]>([])

  const loadDatasets = async () => {
    try {
      await fetchCallForPapers(false)
      await fetchIssues(false)

      const issues = useIssuesStore.getState().data as Issue[]
      const callforpapers = useCallForPapersStore.getState().data as Callforpaper[]

      const articleLabels = issues.map((issue) => issue.pid)
      setArticleLabels(articleLabels)

      const abstractLabels = callforpapers.map((cfp) => cfp.title)
      setAbstractLabels(abstractLabels)

      const articleSeries = await Promise.all(
        articleBarChart.map(async (status) => {
          const data = await Promise.all(
            issues.map(async (issue: Issue) => {
              let res: APIResponseObject = { count: 0, next: null, previous: null, results: [] }
              res = await getArticlesByStatusAndIssues(issue.id, status.value)
              return res.count || 0
            }),
          )
          return { data, stack: 'unique', label: status.label } as ItemsByStatus
        }),
      )
      setArticleSeries(articleSeries)

      const abstractSeries = await Promise.all(
        abstractStatus.map(async (status) => {
          const data = await Promise.all(
            callforpapers.map(async (cfp: Callforpaper) => {
              let res: APIResponseObject = { count: 0, next: null, previous: null, results: [] }
              res = await getAbstractsByStatusAndCallForPapers(cfp.id, status.value)
              return res.count || 0
            }),
          )
          return { data, stack: 'unique', label: status.label } as ItemsByStatus
        }),
      )
      setAbstractSeries(abstractSeries)
    } catch (error) {
      console.error('Error - Fetching bar chart datasets:', error)
    }
  }

  const handleClick = () => setIsArticle((v) => !v)

  useEffect(() => {
    loadDatasets()
  }, [])

  const commonProps = {
    width: 400,
    height: 330,
    hideLegend: true,
    margin: { bottom: 10, right: 20 },
    xAxisBase: {
      id: 'issues',
      scaleType: 'band' as const,
      categoryGapRatio: 0.6,
      disableTicks: true,
      disableLine: true,
      height: 50,
      tickLabelStyle: {
        angle: -50,
        fontSize: 10,
        textAnchor: 'end' as const,
      },
    },
    sx: (theme: any) => ({
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
    }),
    // slotProps: { tooltip: { trigger: 'item' as const } },
  }

  const showNoData = isArticle
    ? articleSeries.length === 0 || articleLabels.length === 0
    : abstractSeries.length === 0 || abstractLabels.length === 0

  return (
    <SmallCard className="home-barchart chart">
      <div className="barchart-header">
        <div className="barchart-header-text">
          <h3 className="barchart-title">
            {t(`KPI.barChart.${isArticle ? 'article' : 'abstract'}.title`)}
          </h3>
          <p>{t(`KPI.barChart.${isArticle ? 'article' : 'abstract'}.description`)}</p>
        </div>
        <Button
          variant="tertiary"
          text={t(`KPI.barChart.button.${isArticle ? 'article' : 'abstract'}`)}
          onClick={() => handleClick()}
          style={{ padding: `var(--space-size-1)`, height: `37px` }}
        />
      </div>

      {/* Article chart */}
      {articleSeries.length > 0 && articleLabels.length > 0 && (
        <div style={{ display: isArticle ? 'block' : 'none' }}>
          <BarChart
            id="article-bar-chart"
            skipAnimation
            series={articleSeries}
            colors={colorsBarChartArticle}
            xAxis={[
              {
                ...commonProps.xAxisBase,
                data: articleLabels,
              },
            ]}
            yAxis={[{ width: 30, tickNumber: 5, disableTicks: true, disableLine: true }]}
            width={commonProps.width}
            height={commonProps.height}
            hideLegend={commonProps.hideLegend}
            margin={commonProps.margin}
            sx={commonProps.sx}
            // slotProps={commonProps.slotProps}
          />
        </div>
      )}

      {/* Abstract chart */}
      {abstractSeries.length > 0 && abstractLabels.length > 0 && (
        <div style={{ display: isArticle ? 'none' : 'block' }}>
          <BarChart
            id="abstract-bar-chart"
            skipAnimation
            series={abstractSeries}
            colors={colorsBarChartAbstract}
            xAxis={[
              {
                ...commonProps.xAxisBase,
                data: abstractLabels,
              },
            ]}
            yAxis={[{ width: 30, tickNumber: 5, disableTicks: true, disableLine: true }]}
            width={commonProps.width}
            height={commonProps.height}
            hideLegend={commonProps.hideLegend}
            margin={commonProps.margin}
            sx={commonProps.sx}
            // slotProps={commonProps.slotProps}
          />
        </div>
      )}

      {showNoData && <Loading />}
    </SmallCard>
  )
}

export default CustomBarChart

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
  getAdvanceArticles,
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

  const [articleSeries, setArticleSeries] = useState<Record<string, any>[]>([])
  const [articleLabels, setArticleLabels] = useState<string[]>([])

  const [abstractSeries, setAbstractSeries] = useState<Record<string, any>[]>([])
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

      const articleSeriesRaw = await Promise.all(
        articleBarChart.map(async (status) => {
          const data = await Promise.all(
            issues.map(async (issue: Issue) => {
              let res: APIResponseObject = { count: 0, next: null, previous: null, results: [] }
              res = await getArticlesByStatusAndIssues(issue.id, status.value)
              return res.count || 0
            }),
          )
          return { data, label: status.label } as ItemsByStatus
        }),
      )
      const formattedArticleData = issues.map((issue, idx) => {
        const obj: Record<string, any> = {
          issueName: issue.name,
          pid: issue.pid,
        }
        articleBarChart.forEach((status, sIdx) => {
          obj[status.label] = articleSeriesRaw[sIdx].data[idx]
        })
        return obj
      })

      const advanceArticles = await getAdvanceArticles()

      const advanceArticlesFormat = {
        issueName: 'Advance Articles',
        pid: 'advance',
        Writing: 0,
        'Technical review': 0,
        'Peer review': 0,
        'Design review': 0,
        Published: advanceArticles.count,
      }
      formattedArticleData.push(advanceArticlesFormat)

      setArticleSeries(formattedArticleData)
      const abstractSeriesRaw = await Promise.all(
        abstractStatus.map(async (status) => {
          const data = await Promise.all(
            callforpapers.map(async (cfp: Callforpaper) => {
              let res: APIResponseObject = { count: 0, next: null, previous: null, results: [] }
              res = await getAbstractsByStatusAndCallForPapers(cfp.id, status.value)
              return res.count || 0
            }),
          )
          return { data, label: status.label } as ItemsByStatus
        }),
      )
      const formattedAbstractData = callforpapers.map((cfp, idx) => {
        const obj: Record<string, any> = {
          cfpTitle: cfp.title,
          id: cfp.id,
        }
        abstractStatus.forEach((status, sIdx) => {
          obj[status.label] = abstractSeriesRaw[sIdx].data[idx]
        })
        return obj
      })

      setAbstractSeries(formattedAbstractData)
    } catch (error) {
      console.error('Error - Fetching bar chart datasets:', error)
    }
  }

  const handleClick = () => setIsArticle((v) => !v)

  useEffect(() => {
    loadDatasets()
  }, [])

  const commonProps = {
    width: 600,
    height: 350,
    hideLegend: true,
    margin: { bottom: 10, right: 20 },
    sx: (theme: any) => ({
      [`.${axisClasses.root}`]: {
        [`.${axisClasses.tickLabel}`]: {
          fill: 'var(--color-gray)',
          fontFamily: "'DM Sans', sans-serif !important",
        },
        [` .MuiChartsAxis-label`]: {
          fill: 'var(--color-deep-blue)',
        },
      },
      [`.${barLabelClasses.root}`]: {
        fill: 'var(--color-deep-blue)',
        fontSize: 12,
      },
    }),
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
          dataTestId="flip-button"
        />
      </div>

      {/* Article chart */}
      {articleSeries.length > 0 && articleLabels.length > 0 && (
        <div style={{ display: isArticle ? 'block' : 'none' }}>
          <BarChart
            id="article-bar-chart"
            data-testid="bar-chart-article"
            skipAnimation
            series={[
              { dataKey: 'Writing', label: 'writing', stack: 'unique' },
              { dataKey: 'Technical review', label: 'technical review', stack: 'unique' },
              { dataKey: 'Peer review', label: 'peer review', stack: 'unique' },
              { dataKey: 'Design review', label: 'design review', stack: 'unique' },
              { dataKey: 'Published', label: 'published', stack: 'unique' },
            ]}
            colors={colorsBarChartArticle}
            dataset={articleSeries}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'pid',
                valueFormatter: (value, context) =>
                  context.location === 'tick'
                    ? value
                    : articleSeries.find((item) => item.pid === value)!.issueName,
                label: 'Issues',
                height: 70,
                tickSize: 5,
                categoryGapRatio: 0.5,
              },
            ]}
            yAxis={[{ width: 30, tickNumber: 5, disableTicks: true, disableLine: true }]}
            width={commonProps.width}
            height={commonProps.height}
            hideLegend={commonProps.hideLegend}
            margin={commonProps.margin}
            sx={commonProps.sx}
          />
        </div>
      )}

      {/* Abstract chart */}
      {abstractSeries.length > 0 && abstractLabels.length > 0 && (
        <div style={{ display: isArticle ? 'none' : 'block' }}>
          <BarChart
            id="abstract-bar-chart"
            data-testid="bar-chart-abstract"
            skipAnimation
            series={[
              { dataKey: 'Published', label: 'Published', stack: 'unique' },
              { dataKey: 'Accepted', label: 'Accepted', stack: 'unique' },
              { dataKey: 'Submitted', label: 'Submitted', stack: 'unique' },
              { dataKey: 'Suspended', label: 'Suspended', stack: 'unique' },
              { dataKey: 'Abandoned', label: 'Abandoned', stack: 'unique' },
              { dataKey: 'Declined', label: 'Declined', stack: 'unique' },
            ]}
            colors={colorsBarChartAbstract}
            dataset={abstractSeries}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'cfpTitle',
                label: 'Call for papers',
                height: 70,
                tickSize: 5,
                categoryGapRatio: 0.5,
                tickLabelStyle: {
                  angle: -50,
                  fontSize: 10,
                  textAnchor: 'end' as const,
                },
              },
            ]}
            yAxis={[{ width: 30, tickNumber: 5, disableTicks: true, disableLine: true }]}
            width={commonProps.width}
            height={commonProps.height}
            hideLegend={commonProps.hideLegend}
            margin={commonProps.margin}
            sx={commonProps.sx}
          />
        </div>
      )}

      {showNoData && <Loading />}
    </SmallCard>
  )
}

export default CustomBarChart

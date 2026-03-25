import './CustomBarChart.css'

import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorsAbstract, colorsArticle } from '../../styles/theme'
import { abstractSeriesKey } from '../../utils/constants/abstract'
import { articleBarChart, articleSeriesKey } from '../../utils/constants/article'
import Button from '../Buttons/Button/Button'
import SmallCard from '../SmallCard/SmallCard'
import { fetchBarChartData } from './fetch'

const CustomBarChart = () => {
  const { t } = useTranslation()
  const [isArticle, setIsArticle] = useState(true)

  const { data } = useSuspenseQuery({
    queryKey: ['barChartData'],
    queryFn: fetchBarChartData,
  })

  const { articleSeries, articleLabels, advanceSeries, abstractSeries, abstractLabels } = data

  const handleClick = () => setIsArticle((v) => !v)

  const commonProps = {
    width: 300,
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
    }),
    xAxis: [{ height: 70, tickSize: 5, categoryGapRatio: 0.5 }],
    yAxis: [{ width: 30, tickNumber: 5, disableTicks: true, disableLine: true }],
  }

  const getMaxYValue = () => {
    const articleMax = Math.max(
      ...articleSeries.flatMap((item) => articleBarChart.map((status) => item[status.label] || 0)),
    )
    const advanceMax = Math.max(
      ...advanceSeries.flatMap((item) => articleBarChart.map((status) => item[status.label] || 0)),
    )
    return Math.max(articleMax, advanceMax, 5)
  }

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

      <div className="article-and-advance-container">
        {/* Article chart */}
        {articleSeries.length > 0 && articleLabels.length > 0 && (
          <div style={{ display: isArticle ? 'block' : 'none' }}>
            <BarChart
              id="article-bar-chart"
              data-testid="bar-chart-article"
              skipAnimation
              series={articleSeriesKey}
              colors={colorsArticle}
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
                  ...commonProps.xAxis[0],
                },
              ]}
              yAxis={commonProps.yAxis}
              width={commonProps.width}
              height={commonProps.height}
              hideLegend={commonProps.hideLegend}
              margin={commonProps.margin}
              sx={commonProps.sx}
            />
          </div>
        )}

        {/* Advance article chart */}
        {advanceSeries.length > 0 && articleLabels.length > 0 && (
          <div style={{ display: isArticle ? 'block' : 'none' }}>
            <BarChart
              id="article-advanced-bar-chart"
              data-testid="bar-chart-article-advanced"
              skipAnimation
              series={articleSeriesKey}
              colors={colorsArticle}
              dataset={advanceSeries}
              xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'pid',
                  valueFormatter: (value, context) =>
                    context.location === 'tick'
                      ? value
                      : advanceSeries.find((item) => item.pid === value)!.issueName,
                  disableTicks: true,
                  disableLine: true,
                  ...commonProps.xAxis[0],
                },
              ]}
              yAxis={[{ position: 'none', min: 0, max: getMaxYValue() }]}
              width={70}
              height={commonProps.height}
              hideLegend={commonProps.hideLegend}
              margin={commonProps.margin}
              sx={commonProps.sx}
            />
          </div>
        )}
      </div>

      {/* Abstract chart */}
      {abstractSeries.length > 0 && abstractLabels.length > 0 && (
        <div style={{ display: isArticle ? 'none' : 'block' }}>
          <BarChart
            id="abstract-bar-chart"
            data-testid="bar-chart-abstract"
            skipAnimation
            series={abstractSeriesKey}
            colors={colorsAbstract}
            dataset={abstractSeries}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'cfpTitle',
                label: 'Call for papers',
                tickLabelStyle: {
                  angle: -50,
                  fontSize: 10,
                  textAnchor: 'end' as const,
                },
                ...commonProps.xAxis[0],
              },
            ]}
            yAxis={commonProps.yAxis}
            width={commonProps.width}
            height={commonProps.height}
            hideLegend={commonProps.hideLegend}
            margin={commonProps.margin}
            sx={commonProps.sx}
          />
        </div>
      )}
    </SmallCard>
  )
}

export default CustomBarChart

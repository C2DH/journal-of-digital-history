import { BarChart, BarChartProps } from '@mui/x-charts'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorPeerReviewSimpleChart } from '../../styles/theme'
import { getPeerReviewArticlesDetails, getPeerReviewArticlesTiming } from '../../utils/api/api'
import Legend from '../Legend/Legend'
import SmallCard from '../SmallCard/SmallCard'
import SmallTable from '../SmallTable/SmallTable'
import { series } from './series'

const PeerReviewSimple = () => {
  const { t } = useTranslation()

  const [label, setLabel] = useState('default')
  const [round, setRound] = useState<number>(8)
  const [item, setItem] = useState({
    key: 'default',
    articles: [{ pid: '', authors: '', title: '', substatus: [''], url: '' }],
  })
  const [firstClick, setFirstClick] = useState(false)
  const [placeholder, setPlaceholder] = useState(true)

  const getPeerReviewArticlesWithTiming = async () => {
    const data = await getPeerReviewArticlesTiming()
    const dataWithoutNull = data.filter(
      (item) => item.ontime != 0 || item.delay != 0 || item.declined != 0 || item.over != 0,
    )
    return dataWithoutNull
  }

  const { data } = useSuspenseQuery({
    queryKey: ['peerReviewSimpleData'],
    queryFn: getPeerReviewArticlesWithTiming,
    staleTime: 0,
  })
  const { data: dataWithDetails } = useQuery({
    queryKey: ['peerReviewArticlesDetails'],
    queryFn: getPeerReviewArticlesDetails,
  })

  function getChartSettings(): BarChartProps {
    return {
      dataset: data,
      height: 80 * data.length,
      margin: { left: 5, right: 0, bottom: 25 },
      series: series,
      slotProps: {
        tooltip: { trigger: 'item' },
      },
      xAxis: [
        {
          position: 'none',
        },
      ],
      yAxis: [
        {
          dataKey: 'order',
          width: 120,
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: {
            fill: 'var(--color-deep-blue)',
            fontWeight: 900,
            fontSize: 16,
            fontFamily: "'DM Sans', sans-serif !important",
          },
        },
      ],
      colors: colorPeerReviewSimpleChart,
    }
  }

  useEffect(() => {
    const temp = dataWithDetails?.find((item) => item.key === `${label}-R${round}`)
    if (temp) {
      setItem(temp)
      setPlaceholder(false)
      setFirstClick(false)
    }
  }, [round, label, dataWithDetails])

  return (
    <>
      <SmallCard className="home-peerreviewchart-simple chart">
        <h2>{t('KPI.peerReviewChart.simple.title')}</h2>
        {data.length > 0 && (
          <BarChart
            sx={{
              '.MuiBarChart-element': {
                strokeWidth: 1,
                stroke: 'white',
              },
              '.MuiBarChart-label': {
                fill: 'white',
                fontWeight: 700,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
            {...getChartSettings()}
            hideLegend
            onItemClick={(event, d) => {
              setFirstClick(true)
              setLabel(String(d.seriesId))
              setRound(Number(d.dataIndex + 1))
            }}
          />
        )}
        <Legend series={series} colors={colorPeerReviewSimpleChart} />
      </SmallCard>
      {
        <SmallCard
          className={`home-peerreviewchart-next-table chart ${placeholder ? 'light' : ''}`}
        >
          <h2 className="home-peerreviewchart-next-table-title">
            {`${t(`KPI.peerReviewChart.${label}`)} ${label != 'over' ? (round != 8 ? `- R${round}` : '') : ''}`}
          </h2>
          <SmallTable
            item="articles"
            headers={['pid', 'title', 'authors', 'ojs_status', 'url', 'github_issue']}
            data={item.articles}
            placeholder={placeholder}
            loading={firstClick}
          ></SmallTable>
        </SmallCard>
      }
    </>
  )
}

export default PeerReviewSimple

import './PeerReviewChart.css'

import { BarChart, BarChartProps } from '@mui/x-charts'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { colorsPeerReviewChart } from '../../styles/theme'
import { getPeerReviewArticlesByStage, getPeerReviewArticlesDetails } from '../../utils/api/api'
import SmallCard from '../SmallCard/SmallCard'
import SmallTable from '../SmallTable/SmallTable'
import { series } from './constant'
import Legend from './Legend'

const PeerReviewChart = () => {
  const { t } = useTranslation()
  const [label, setLabel] = useState('Default')
  const [round, setRound] = useState<number>(4)
  const [item, setItem] = useState({
    key: 'default',
    articles: [{ pid: '', authors: '', title: '', substatus: [''], url: '' }],
  })
  const [firstClick, setFirstClick] = useState(false)
  const [placeholder, setPlaceholder] = useState(true)

  const getPeerReviewByStage = async () => {
    const data = await getPeerReviewArticlesByStage()
    const dataWithoutNull = data.filter(
      (item) =>
        item.assign != 0 ||
        item.awaiting != 0 ||
        item.review != 0 ||
        item.reviewer != 0 ||
        item.revising != 0,
    )
    return dataWithoutNull
  }

  const { data } = useSuspenseQuery({
    queryKey: ['peerReviewData'],
    queryFn: getPeerReviewByStage,
    staleTime: 0,
  })

  const { data: allItems } = useQuery({
    queryKey: ['peerReviewArticlesDetails'],
    queryFn: getPeerReviewArticlesDetails,
  })

  useEffect(() => {
    const temp = allItems?.find((item) => item.key === `${label}-R${round}`)
    if (temp) {
      setItem(temp)
      setPlaceholder(false)
      setFirstClick(false)
    }
  }, [round, label, allItems])

  function getChartSettings(): BarChartProps {
    return {
      dataset: data,
      series: series,
      height: 100,
      width: 400,
      margin: { left: 0, top: 0, right: 30, bottom: 10 },
      xAxis: [
        {
          position: 'none',
        },
      ],
      yAxis: [
        {
          dataKey: 'order',
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
      slotProps: {
        tooltip: { trigger: 'item' },
      },
      colors: colorsPeerReviewChart,
    }
  }

  return (
    <>
      <SmallCard className="home-peerreviewchart chart">
        <h2 className="home-peerreviewchart-title">{t('KPI.peerReviewChart.title')}</h2>
        <BarChart
          sx={{
            '.MuiBarElement-root': {
              strokeWidth: 2,
              stroke: 'white',
            },
            '.MuiBarChart-label': {
              fill: 'white',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
          onItemClick={(event, d) => {
            setFirstClick(true)
            setLabel(String(d.seriesId))
            setRound(Number(d.dataIndex + 1))
          }}
          {...getChartSettings()}
          hideLegend
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, marginLeft: 50 }}
        >
          <Legend />
        </div>
      </SmallCard>
      {
        <SmallCard
          className={`home-peerreviewchart-next-table chart ${placeholder ? 'light' : ''}`}
        >
          <h2 className="home-peerreviewchart-next-table-title">
            {t('KPI.peerReviewChart.table.title')}
          </h2>
          <SmallTable
            item="articles"
            headers={['pid', 'title', 'authors', 'substatus', 'url']}
            data={item.articles}
            placeholder={placeholder}
            loading={firstClick}
          ></SmallTable>
        </SmallCard>
      }
    </>
  )
}

export default PeerReviewChart

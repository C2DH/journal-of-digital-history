import '../../styles/pages/Authors.css'
import '../../styles/pages/pages.css'

import { BarChart } from '@mui/x-charts'
import { PieChart } from '@mui/x-charts/PieChart'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import AuthorCard from '../../components/Card/AuthorCard/AuthorCard'
import Card from '../../components/Card/Card'
import PieCenterLabel from '../../components/CustomPieChart/PieCenterLabel/PieCenterLabel'
import SmallCard from '../../components/SmallCard/SmallCard'
import { useSorting } from '../../hooks/useSorting'
import { useAuthorStore, useItemsStore } from '../../store'
import { getAuthorStats } from '../../utils/api/api'
import { getBarChartSettings, getPieChartSettings } from './getChartSettings'

const Authors = () => {
  const { t } = useTranslation()
  const { sortBy, sortOrder, ordering, setFilters } = useSorting()
  const {
    data: authors,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
  } = useItemsStore()
  const { data: authorDetail } = useAuthorStore()

  const isEmpty = Object.keys(authorDetail).length != 0

  useEffect(() => {
    setParams({ endpoint: 'authors', limit: 20, ordering })
    fetchItems(true)
  }, [ordering])

  const { data } = useSuspenseQuery({
    queryKey: ['authorData'],
    queryFn: getAuthorStats,
  })

  return (
    <div className="authors page">
      <Card
        item="authors"
        headers={['id', 'lastname', 'firstname', 'abstracts', 'accepted', 'published']}
        data={authors}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy ?? undefined}
        sortOrder={sortOrder ?? undefined}
        setSort={({ sortOrder, sortBy }) => setFilters({ sortOrder, sortBy })}
      />
      <SmallCard className="authors piechart chart">
        <h3>{t('authors.KPI.pieChart')}</h3>
        <PieChart
          series={[
            {
              innerRadius: 60,
              outerRadius: 100,
              data: data['first-time_vs_returning'],
              highlightScope: { fade: 'global', highlight: 'item' },
              arcLabel: (item) => (item.value != 0 ? `${item.value}` : ''),
            },
          ]}
          {...getPieChartSettings()}
        >
          <PieCenterLabel total={data['total']}> authors</PieCenterLabel>
        </PieChart>
      </SmallCard>
      <SmallCard className="authors barchart chart">
        <h3>{t('authors.KPI.barChart')}</h3>
        <BarChart
          dataset={data['coauthorship']}
          series={[
            {
              dataKey: 'value',
              barLabel: 'value',
              barLabelPlacement: 'outside',
            },
          ]}
          {...getBarChartSettings()}
        />
      </SmallCard>
      {isEmpty && <AuthorCard author={authorDetail} />}
    </div>
  )
}

export default Authors

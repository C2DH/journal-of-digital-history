import '../../styles/pages/Authors.css'
import '../../styles/pages/pages.css'

import { BarChart } from '@mui/x-charts'
import { PieChart } from '@mui/x-charts/PieChart'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import AuthorCard from '../../components/Card/AuthorCard/AuthorCard'
import Card from '../../components/Card/Card'
import PieCenterLabel from '../../components/CustomPieChart/PieCenterLabel/PieCenterLabel'
import FilterBar from '../../components/FilterBar/FilterBar'
import SmallCard from '../../components/SmallCard/SmallCard'
import SmallTable from '../../components/SmallTable/SmallTable'
import { useSorting } from '../../hooks/useSorting'
import { useAuthorStore, useFilterBarStore, useItemsStore, useSearchStore } from '../../store'
import { getAuthorStats } from '../../utils/api/api'
import { getBarChartSettings, getPieChartSettings } from './getChartSettings'

const Authors = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { query, resetSearch } = useSearchStore()

  // TODO : Update filters with authors'filters final version
  const { updateFromStores, changeFilters, changeQueryParams, syncFiltersWithURL } =
    useFilterBarStore()
  const filters = useFilterBarStore((state) => state.filters)

  const { sortBy, sortOrder, ordering, setFilters } = useSorting()
  const {
    data: authors,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
    reset,
  } = useItemsStore()
  const { data: authorDetail } = useAuthorStore()

  const isEmpty = Object.keys(authorDetail).length != 0

  useEffect(() => {
    resetSearch()
  }, [])

  useEffect(() => {
    reset()
    updateFromStores(false)
    syncFiltersWithURL(searchParams)
    const { params: queryParams } = changeQueryParams(false) as { params?: Record<string, unknown> }
    const { endpoint } = changeQueryParams(false) as { endpoint?: string }
    setParams({
      endpoint: endpoint ?? 'authors',
      limit: 20,
      ordering,
      search: query,
      params: queryParams,
    })
    fetchItems(true)
  }, [ordering, query])

  const { data } = useSuspenseQuery({
    queryKey: ['authorData'],
    queryFn: getAuthorStats,
  })

  return (
    <div className="authors page">
      <FilterBar filters={filters} onFilterChange={changeFilters} />
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
        <PieChart
          series={[
            {
              innerRadius: 45,
              outerRadius: 80,
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
      {isEmpty && (
        <div className="card-author-detail">
          <AuthorCard author={authorDetail} />
        </div>
      )}
      {isEmpty && (
        <SmallCard className="author-contribution">
          <SmallTable
            item="contribution"
            headers={['pid', 'title', 'type', 'status']}
            data={authorDetail['contributions']}
          />
        </SmallCard>
      )}
    </div>
  )
}

export default Authors

import '../styles/pages/pages.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import Card from '../components/Card/Card'
import Counter from '../components/Counter/Counter'
import FilterBar from '../components/FilterBar/FilterBar'
import { useSorting } from '../hooks/useSorting'
import { useFilterBarStore, useItemsStore, useSearchStore } from '../store'

const Articles = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { sortBy, sortOrder, ordering, setFilters } = useSorting()
  const query = useSearchStore((state) => state.query)
  const {
    count,
    data: articles,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
  } = useItemsStore()
  const { updateFromStores, changeFilters, changeQueryParams, syncFiltersWithURL } =
    useFilterBarStore()
  const filters = useFilterBarStore((state) => state.filters)

  useEffect(() => {
    updateFromStores(false)
    syncFiltersWithURL(searchParams)

    const queryParams = changeQueryParams(false)
    setParams({
      endpoint: 'articles',
      limit: 20,
      ordering,
      search: query,
      params: queryParams,
    })
    fetchItems(true)
  }, [searchParams, updateFromStores, syncFiltersWithURL, setParams, fetchItems, ordering, query])

  return (
    <div className="articles page">
      <div className="card-header-title">
        <h1>{t(`articles.item`)}</h1>
        {count && <Counter value={count} />}
      </div>
      <FilterBar filters={filters} onFilterChange={changeFilters} />
      <Card
        item="articles"
        headers={[
          'abstract__pid',
          'abstract__title',
          'publication_date',
          'abstract__contact_lastname',
          'abstract__contact_firstname',
          'status',
          'repository_url',
        ]}
        count={count}
        data={articles}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy || undefined}
        sortOrder={sortOrder || undefined}
        setSort={({ sortOrder, sortBy }) => setFilters({ sortOrder, sortBy })}
      />
    </div>
  )
}

export default Articles

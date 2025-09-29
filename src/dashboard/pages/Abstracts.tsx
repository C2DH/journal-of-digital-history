import '../styles/pages/pages.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import Card from '../components/Card/Card'
import Counter from '../components/Counter/Counter'
import FilterBar from '../components/FilterBar/FilterBar'
import { useSorting } from '../hooks/useSorting'
import { useFilterBarStore, useItemsStore, useSearchStore } from '../store'

const Abstracts = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { sortBy, sortOrder, ordering, setFilters } = useSorting()
  const query = useSearchStore((state) => state.query)
  const {
    count,
    data: abstracts,
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
    updateFromStores(true)
    syncFiltersWithURL(searchParams)
    const queryParams = changeQueryParams(true)
    setParams({
      endpoint: 'abstracts',
      limit: 20,
      ordering,
      search: query,
      params: queryParams,
    })
    fetchItems(true)
  }, [searchParams, updateFromStores, syncFiltersWithURL, setParams, fetchItems, ordering, query])

  return (
    <div className="abstract page">
      <div className="card-header-title">
        <h1>{t(`abstracts.item`)}</h1>
        {count && <Counter value={count} />}
      </div>
      <FilterBar filters={filters} onFilterChange={changeFilters} />
      <Card
        item="abstracts"
        headers={[
          'pid',
          'title',
          'callpaper_title',
          'submitted_date',
          'contact_lastname',
          'contact_firstname',
          'contact_affiliation',
          'status',
        ]}
        count={count}
        data={abstracts}
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

export default Abstracts

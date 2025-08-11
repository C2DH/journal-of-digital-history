import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import FilterBar from '../components/FilterBar/FilterBar'
import { useFilterBar } from '../hooks/useFilterBar'
import { useFilters } from '../hooks/useFilters'
import { useItemsStore, useSearchStore } from '../store'

const Abstracts = () => {
  const { sortBy, sortOrder, ordering, setFilters } = useFilters()
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

  useEffect(() => {
    setParams({ endpoint: 'abstracts', limit: 20, ordering, search: query })
    fetchItems(true)
  }, [setParams, fetchItems, ordering, query])

  const { filters, handleFilterChange } = useFilterBar()

  return (
    <div className="abstract page">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
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
        setSortBy={(newSortBy) => setFilters({ sortBy: newSortBy })}
        setSortOrder={(newSortOrder) => setFilters({ sortOrder: newSortOrder })}
      />
    </div>
  )
}

export default Abstracts

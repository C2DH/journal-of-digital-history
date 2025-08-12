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
  const { filters, handleFilterChange } = useFilterBar()

  useEffect(() => {
    const params = filters.reduce((acc, filter) => {
      if (filter.value) {
        if (filter.name === 'issue') {
          //exception for sorting on 'issues' it should call 'article__issue'
          acc['article__issue'] = filter.value.replace(/^jdh0+/, '')
        } else {
          acc[filter.name] = filter.value
        }
      }
      return acc
    }, {})
    setParams({
      endpoint: 'abstracts',
      limit: 20,
      ordering,
      search: query,
      params,
    })
    fetchItems(true)
  }, [setParams, fetchItems, ordering, query, filters])

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

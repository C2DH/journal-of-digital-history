import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import FilterBar from '../components/FilterBar/FilterBar'
import { useSorting } from '../hooks/useSorting'
import { useFilterBarStore, useItemsStore, useSearchStore } from '../store'

const Articles = () => {
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
  const { setFilter, initFilters, updateFromStores } = useFilterBarStore()
  const filters = useFilterBarStore((state) => state.filters)

  useEffect(() => {
    if (!filters || filters.length === 0) {
      initFilters()
      updateFromStores(false)
    } else {
      updateFromStores(false)
    }
  }, [])

  useEffect(() => {
    const params = filters.reduce((acc, filter) => {
      if (filter.value) {
        if (filter.name === 'callpaper') {
          //exception for sorting on 'call for paper' it should call 'abstract__callpaper'
          acc['abstract__callpaper'] = filter.value
        } else if (filter.name === 'issue') {
          acc['issue'] = filter.value.replace(/^jdh0+/, '')
        } else {
          acc[filter.name] = filter.value
        }
      }
      return acc
    }, {})
    setParams({ endpoint: 'articles', limit: 20, ordering, search: query, params })
    fetchItems(true)
  }, [setParams, fetchItems, ordering, query, filters])

  return (
    <div className="articles page">
      <FilterBar filters={filters} onFilterChange={setFilter} />
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
        setSortBy={(newSortBy) => setFilters({ sortBy: newSortBy })}
        setSortOrder={(newSortOrder) => setFilters({ sortOrder: newSortOrder })}
      />
    </div>
  )
}

export default Articles

import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import { useFilters } from '../hooks/useFilters'
import { useItemsStore, useSearchStore } from '../store'

const Articles = () => {
  const { sortBy, sortOrder, ordering, setFilters } = useFilters()
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
    reset,
  } = useItemsStore()

  useEffect(() => {
    reset()
    setParams({ endpoint: 'articles', limit: 20, ordering, search: query })
    fetchItems(true)
  }, [setParams, fetchItems, ordering, query])

  return (
    <div className="articles page">
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

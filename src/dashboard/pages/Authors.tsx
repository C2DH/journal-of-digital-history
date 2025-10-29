import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import { useSorting } from '../hooks/useSorting'
import { useItemsStore } from '../store'

const Authors = () => {
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

  useEffect(() => {
    setParams({ endpoint: 'authors', limit: 20, ordering })
    fetchItems(true)
  }, [ordering])

  return (
    <div className="authors page">
      <div className="empty-space"></div>
      <Card
        item="authors"
        headers={['id', 'lastname', 'firstname', 'email', 'orcid', 'affiliation']}
        data={authors}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy ?? undefined}
        sortOrder={sortOrder ?? undefined}
        setSort={({ sortOrder, sortBy }) => setFilters({ sortOrder, sortBy })}
      />
    </div>
  )
}

export default Authors

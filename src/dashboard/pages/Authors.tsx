import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { useFilters } from '../hooks/useFilters'
import { Author } from '../utils/types'

import '../styles/pages/pages.css'

const Authors = () => {
  const { sortBy, sortOrder, ordering, setFilters } = useFilters()
  const {
    data: authors,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Author>('/authors', 10, ordering)

  return (
    <div className="authors page">
      <Card
        item="authors"
        headers={['id', 'lastname', 'firstname', 'email', 'orcid', 'affiliation']}
        data={authors}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={(newSortBy) => setFilters({ sortBy: newSortBy })}
        setSortOrder={(newSortOrder) => setFilters({ sortOrder: newSortOrder })}
      />
    </div>
  )
}

export default Authors

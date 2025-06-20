import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { useFilters } from '../hooks/useFilters'
import { Article } from '../utils/types'

import '../styles/pages/pages.css'

const Articles = () => {
  const { sortBy, sortOrder, ordering, setFilters } = useFilters()
  const {
    data: articles,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Article>('articles', 20, ordering)

  return (
    <div className="articles page">
      <Card
        item="articles"
        headers={[
          'abstract__pid',
          'abstract__title',
          'callpaper',
          'submitted_date',
          'validation_date',
          'publication_date',
          'status',
          'repository_url',
        ]}
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

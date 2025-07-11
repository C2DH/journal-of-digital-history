import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { useFilters } from '../hooks/useFilters'
import '../styles/pages/pages.css'
import { Abstract } from '../utils/types'

const Abstracts = () => {
  const { sortBy, sortOrder, ordering, setFilters } = useFilters()
  const {
    data: abstracts,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Abstract>('abstracts', 10, ordering)

  return (
    <div className="abstract page">
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

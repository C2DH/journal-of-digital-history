import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import FilterBar from '../components/FilterBar/FilterBar'
import { useFilters } from '../hooks/useFilters'
import { useItemsStore, useSearchStore } from '../store'

// Example filter array for FilterBar

const filters = [
  {
    name: 'callForPaper',
    value: '', // default selected value
    options: [
      { value: '', label: 'Call for Paper' },
      { value: 'ai-history', label: 'AI & History' },
      { value: 'web-history', label: 'History Seeing Through the Web' },
      { value: 'teaching-dh', label: 'Teaching Digital History' },
    ],
  },
  {
    name: 'issue',
    value: '',
    options: [
      { value: '', label: 'Issue' },
      { value: 'issue5', label: 'Issue n.5 DH China' },
      { value: 'issue4', label: 'Issue n.4 Varia' },
      { value: 'issue3', label: 'Issue n.3 Digital Tools' },
      { value: 'issue2', label: 'Issue n.2 Varia' },
      { value: 'issue1', label: 'Issue n.1 Scalable historiography' },
    ],
  },
  {
    name: 'status',
    value: '',
    options: [
      { value: '', label: 'Status' },
      { value: 'submitted', label: 'Submitted' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'declined', label: 'Declined' },
      { value: 'abandoned', label: 'Abandoned' },
    ],
  },
]

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

  return (
    <div className="abstract page">
      <FilterBar filters={filters} onFilterChange={setFilters} />
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

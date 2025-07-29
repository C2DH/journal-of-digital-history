import '../styles/pages/pages.css'

import TabPanel from '../components/TabPanel/TabPanel'
import { useFetchItems } from '../hooks/useFetch'
import { useFilters } from '../hooks/useFilters'
import { useSearchStore } from '../store'
import { Abstract } from '../utils/types'

const Abstracts = () => {
  const { sortBy, sortOrder, ordering, setFilters } = useFilters()
  const query = useSearchStore((state) => state.query)

  const {
    count,
    data: abstracts,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Abstract>('abstracts', 10, ordering, query)

  const tabs = [
    { label: 'Home', content: <div>Home Content</div> },
    { label: 'Profile', content: <div>Profile Content</div> },
    { label: 'Settings', content: <div>Settings Content</div> },
  ]

  return (
    <div className="abstract page">
      <TabPanel tabs={tabs} />
      {/* <Card
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
      /> */}
    </div>
  )
}

export default Abstracts

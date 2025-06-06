import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { Abstract } from '../interfaces/abstract'

import '../styles/pages/pages.css'

const Abstracts = () => {
  const {
    data: abstracts,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Abstract>('abstracts', 10)

  return (
    <div className="abstract page">
      <Card
        item="abstracts"
        headers={[
          'pid',
          'title',
          'submitted_date',
          'validation_date',
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
      />
    </div>
  )
}

export default Abstracts

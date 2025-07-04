import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { Dataset } from '../utils/types'

import '../styles/pages/pages.css'

const Datasets = () => {
  const {
    data: datasets,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Dataset>('datasets', 20)

  return (
    <div className="datasets page">
      <Card
        item="datasets"
        headers={['id', 'url', 'description']}
        data={datasets}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  )
}

export default Datasets

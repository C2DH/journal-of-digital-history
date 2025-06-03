import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/useFetch'
import { Dataset } from '../interfaces/dataset'

import '../styles/pages/pages.css'

const Datasets = () => {
  const {
    data: datasets,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Dataset>('/api/datasets', USERNAME, PASSWORD, 20)

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

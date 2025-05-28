import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Dataset } from '../interfaces/dataset'

import '../styles/pages/pages.css'

const Datasets = () => {
  const {
    data: datasets,
    error,
    loading,
  } = useFetchItems<Dataset>('/api/datasets', USERNAME, PASSWORD)

  return (
    <div className="datasets page">
      <Card
        item="datasets"
        headers={['id', 'url', 'description']}
        data={datasets}
        error={error}
        loading={loading}
      />
    </div>
  )
}

export default Datasets

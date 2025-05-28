import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Abstract } from '../interfaces/abstract'

import '../styles/pages/pages.css'

const Abstracts = () => {
  const {
    data: abstracts,
    error,
    loading,
  } = useFetchItems<Abstract>('/api/abstracts', USERNAME, PASSWORD)

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
      />
    </div>
  )
}

export default Abstracts

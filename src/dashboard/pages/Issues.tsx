import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Issue } from '../interfaces/issue'

import '../styles/pages/pages.css'

const Issues = () => {
  const { data: issues, error, loading } = useFetchItems<Issue>('/api/issues', USERNAME, PASSWORD)

  return (
    <div className="issues page">
      <Card
        item="issues"
        headers={['pid', 'name', 'creation_date', 'publication_date', 'status', 'volume', 'issue']}
        data={issues}
        error={error}
        loading={loading}
      />
    </div>
  )
}

export default Issues

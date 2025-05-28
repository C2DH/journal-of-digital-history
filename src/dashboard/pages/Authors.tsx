import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Author } from '../interfaces/author'

import '../styles/pages/pages.css'

const Authors = () => {
  const {
    data: authors,
    error,
    loading,
  } = useFetchItems<Author>('/api/authors', 100, 0, USERNAME, PASSWORD)

  return (
    <div className="authors page">
      <Card
        item="authors"
        headers={['id', 'lastname', 'firstname', 'email', 'orcid', 'affiliation']}
        data={authors}
        error={error}
        loading={loading}
      />
    </div>
  )
}

export default Authors

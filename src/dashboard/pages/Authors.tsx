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
    hasMore,
    loadMore,
  } = useFetchItems<Author>('/api/authors', USERNAME, PASSWORD, 20)

  return (
    <div className="authors page">
      <Card
        item="authors"
        headers={['id', 'lastname', 'firstname', 'email', 'orcid', 'affiliation']}
        data={authors}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  )
}

export default Authors

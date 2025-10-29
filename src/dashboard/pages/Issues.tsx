import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import { useItemsStore } from '../store'

const Issues = () => {
  const { data: issues, loading, error, hasMore, fetchItems, setParams, loadMore } = useItemsStore()

  useEffect(() => {
    setParams({ endpoint: 'issues', limit: 20 })
    fetchItems(true)
  }, [])

  return (
    <div className="issues page">
      <div className="empty-space"></div>
      <Card
        item="issues"
        headers={['pid', 'name', 'creation_date', 'publication_date', 'status', 'volume', 'issue']}
        data={issues}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  )
}

export default Issues

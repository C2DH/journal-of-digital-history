import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import { useItemsStore } from '../store'

const Datasets = () => {
  const {
    data: datasets,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
  } = useItemsStore()

  useEffect(() => {
    setParams({ endpoint: 'datasets', limit: 20 })
    fetchItems(true)
  }, [])

  return (
    <div className="datasets page">
      <div className="empty-space"></div>
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

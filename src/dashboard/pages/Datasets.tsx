import '../styles/pages/pages.css'

import { useEffect } from 'react'

import Card from '../components/Card/Card'
import Loading from '../components/Loading/Loading'
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
    reset,
    endpoint,
  } = useItemsStore()

  useEffect(() => {
    reset()
    setParams({ endpoint: 'datasets', limit: 20, params: {} })
    fetchItems(true)
  }, [])

  // FIX for removing previous data from other pages
  if (loading || endpoint !== 'datasets') {
    return <Loading />
  }

  return (
    <div className="datasets page">
      <Card
        item="datasets"
        headers={['url', 'description']}
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

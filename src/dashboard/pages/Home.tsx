import '../styles/pages/pages.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import Card from '../components/Card/Card'
import { useItemsStore } from '../store'

const Home = () => {
  const { t } = useTranslation()
  const { data: issues, loading, error, hasMore, fetchItems, setParams, loadMore } = useItemsStore()

  useEffect(() => {
    setParams({ endpoint: 'issues', limit: 20 })
    fetchItems(true)
  }, [])
  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <Card
        item="issues"
        headers={['pid', 'name', 'creation_date', 'publication_date', 'status', 'volume', 'issue']}
        data={issues}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
      <Outlet />
    </div>
  )
}

export default Home

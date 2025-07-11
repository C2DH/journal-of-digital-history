import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { Issue } from '../utils/types'

import '../styles/pages/pages.css'

const Home = () => {
  const { t } = useTranslation()
  const { data: issues, error, loading, hasMore, loadMore } = useFetchItems<Issue>('issues', 10)

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

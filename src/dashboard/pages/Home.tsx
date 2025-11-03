import '../styles/pages/Home.css'
import '../styles/pages/pages.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useSearchParams } from 'react-router'

import Card from '../components/Card/Card'
import CustomBarChart from '../components/CustomBarChart/CustomBarChart'
import CustomPieChart from '../components/CustomPieChart/CustomPieChart'
import { useSorting } from '../hooks/useSorting'
import { useItemsStore } from '../store'

const Home = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { sortBy, sortOrder, ordering, setFilters } = useSorting()

  const {
    count,
    data: submittedAbstracts,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
  } = useItemsStore()

  useEffect(() => {
    setParams({
      endpoint: 'abstracts',
      limit: 5,
      ordering,
      params: { status: 'SUBMITTED' },
    })
    fetchItems(true)
  }, [searchParams, setParams, fetchItems, ordering])

  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <div className="home-grid">
        <Card
          item="abstracts.submitted"
          headers={[
            'title',
            'callpaper_title',
            'submitted_date',
            'contact_lastname',
            'contact_firstname',
          ]}
          data={submittedAbstracts}
          sortBy={sortBy || undefined}
          sortOrder={sortOrder || undefined}
          setSort={({ sortOrder, sortBy }) => setFilters({ sortOrder, sortBy })}
        />
        <CustomPieChart />
        <CustomBarChart />
      </div>
      <Outlet />
    </div>
  )
}

export default Home

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

  const { data: submittedAbstracts, fetchItems, setParams } = useItemsStore()

  useEffect(() => {
    setParams({
      endpoint: 'abstracts',
      limit: 5,
      ordering: '-submitted_date',
      params: { status: 'SUBMITTED' },
    })
    fetchItems(true)
  }, [searchParams, setParams, fetchItems, ordering])

  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <div className="home-grid">
        <Card
          item="abstracts"
          headers={[
            'pid',
            'title',
            'callpaper_title',
            'submitted_date',
            'contact_lastname',
            'contact_firstname',
          ]}
          data={submittedAbstracts}
          isSmallTable={true}
        />
        <CustomPieChart />
        <CustomBarChart />
      </div>
      <Outlet />
    </div>
  )
}

export default Home

import '../styles/pages/Home.css'
import '../styles/pages/pages.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import CustomBarChart from '../components/CustomBarChart/CustomBarChart'
import CustomPieChart from '../components/CustomPieChart/CustomPieChart'
import SmallCard from '../components/SmallCard/SmallCard'
import SmallTable from '../components/SmallTable /SmallTable'
import { useSorting } from '../hooks/useSorting'
import { useItemsStore } from '../store'

const Home = () => {
  const { t } = useTranslation()
  const { ordering } = useSorting()
  const { data: submittedAbstracts, fetchItems, setParams } = useItemsStore()

  useEffect(() => {
    setParams({
      endpoint: 'abstracts',
      limit: 5,
      ordering: '-submitted_date',
      params: { status: 'SUBMITTED' },
    })
    fetchItems(true)
  }, [setParams, fetchItems, ordering])

  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <div className="home-grid">
        <>
          <SmallCard className="home-abstract-card chart">
            <h2 className="home-abstract-card-title">{t(`abstracts.small`)}</h2>
            <SmallTable
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
            />
          </SmallCard>
        </>
        <CustomPieChart />
        <CustomBarChart />
      </div>
      <Outlet />
    </div>
  )
}

export default Home

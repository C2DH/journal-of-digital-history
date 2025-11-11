import '../styles/pages/Home.css'
import '../styles/pages/pages.css'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import Badge from '../components/Badge/Badge'
import CustomBarChart from '../components/CustomBarChart/CustomBarChart'
import CustomPieChart from '../components/CustomPieChart/CustomPieChart'
import Deadline from '../components/Deadline/Deadline'
import SmallCard from '../components/SmallCard/SmallCard'
import SmallTable from '../components/SmallTable /SmallTable'
import { useSorting } from '../hooks/useSorting'
import { useItemsStore } from '../store'
import { Abstract } from '../utils/types'

const AbstractSubmittedCard = (submittedAbstracts: Abstract[]) => {
  return (
    <>
      {' '}
      <SmallCard className="home-abstract-card chart">
        <div className="home-abstract-card-header">
          <h2 className="home-abstract-card-title">Abstracts</h2>{' '}
          <Badge text="New" variant="accent" />
        </div>
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
  )
}

const Home = () => {
  const { t } = useTranslation()
  const { ordering } = useSorting()
  const { data: submittedAbstracts, fetchItems, setParams } = useItemsStore()
  const isAbstractSubmitted = submittedAbstracts.length != 0

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
      <div className={`home-grid ${isAbstractSubmitted ? 'isAbstract' : ''}`}>
        <div className="home-counter-row">
          {' '}
          <Deadline />
        </div>
        <>{isAbstractSubmitted && AbstractSubmittedCard(submittedAbstracts)}</>
        <CustomPieChart />
        <CustomBarChart />
      </div>
      <Outlet />
    </div>
  )
}

export default Home

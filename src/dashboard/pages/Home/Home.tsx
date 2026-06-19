import '../../styles/pages/Home.css'
import '../../styles/pages/pages.css'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import Badge from '../../components/Badge/Accent/Badge'
import CustomBarChart from '../../components/CustomBarChart/CustomBarChart'
import CustomPieChart from '../../components/CustomPieChart/CustomPieChart'
import Deadline from '../../components/Deadline/Deadline'
import PeerReviewChart from '../../components/PeerReviewChart/PeerReviewChart'
import PeerReviewSimple from '../../components/PeerReviewSimple/PeerReviewSimple'
import SmallCard from '../../components/SmallCard/SmallCard'
import SmallTable from '../../components/SmallTable/SmallTable'
import { useItemsStore } from '../../store'
import { getCallforpaperWithDeadlineOpen } from '../../utils/api/api'
import { Abstract, Callforpaper } from '../../utils/types'

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

const KPIRow = () => {
  const [cfpOpen, setCfpOpen] = useState<Callforpaper[]>([])

  const fetchCfpOpenData = async () => {
    try {
      const cfpOpen = await getCallforpaperWithDeadlineOpen()
      return cfpOpen
    } catch (error) {
      console.error('Error fetching Call for Papers:', error)
      return []
    }
  }

  const { data } = useSuspenseQuery({
    queryKey: ['cfpOpenData'],
    queryFn: fetchCfpOpenData,
  })

  return (
    <div className="home-counter-row">
      {data.map((cfp) => (
        <Deadline
          key={cfp.id}
          title={cfp.title}
          deadlineAbstract={cfp.deadline_abstract}
          deadlineArticle={cfp.deadline_article}
        />
      ))}
    </div>
  )
}

const Home = () => {
  const { t } = useTranslation()
  const { fetchItems, setParams, reset } = useItemsStore()

  const fetchNewAbstractData = async (): Promise<Abstract[]> => {
    reset()
    setParams({
      endpoint: 'abstracts',
      limit: 8,
      ordering: '-submitted_date',
      params: { status: 'SUBMITTED' },
      search: '',
    })
    await fetchItems(true)
    return useItemsStore.getState().data as Abstract[]
  }

  const { data } = useSuspenseQuery({
    queryKey: ['newAbstractData'],
    queryFn: fetchNewAbstractData,
  })

  return (
    <div className="home page">
      <h1 className="home-welcome">{t('welcome')}</h1>
      <div className={`home-grid ${data && data.length > 0 ? 'isAbstract' : ''}`}>
        <KPIRow />
        <CustomPieChart />
        <CustomBarChart />
        <>{data && data.length > 0 && AbstractSubmittedCard(data)}</>
        <PeerReviewChart />
        <PeerReviewSimple />
      </div>
      <Outlet />
    </div>
  )
}

export default Home

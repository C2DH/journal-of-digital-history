import '../../styles/pages/Home.css'
import '../../styles/pages/pages.css'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import Badge from '../../components/Badge/Badge'
import CustomBarChart from '../../components/CustomBarChart/CustomBarChart'
import CustomPieChart from '../../components/CustomPieChart/CustomPieChart'
import Deadline from '../../components/Deadline/Deadline'
import SmallCard from '../../components/SmallCard/SmallCard'
import SmallTable from '../../components/SmallTable/SmallTable'
import { useSorting } from '../../hooks/useSorting'
import { useItemsStore } from '../../store'
import { getAbstractsSubmittedToOJS, getCallforpaperWithDeadlineOpen } from '../../utils/api/api'
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

const PeerReviewCounter = () => {
  const getCount = async () => {
    try {
      const res = await getAbstractsSubmittedToOJS()
      return res.count ?? 0
    } catch {
      console.error('Error fetching count of abstracts submitted to OJS for peer review.')
      return 0
    }
  }
  const { data: count } = useSuspenseQuery({
    queryKey: ['deadlineOJSCounter'],
    queryFn: getCount,
  })

  useEffect(() => {
    getCount()
  }, [])

  return count != 0 && <Deadline title="Ready for" value={count} />
}

const KPIRow = () => {
  const [cfpOpen, setCfpOpen] = useState<Callforpaper[]>([])

  const getCallforpaper = async () => {
    try {
      const cfpOpen = await getCallforpaperWithDeadlineOpen()
      setCfpOpen(cfpOpen)
    } catch (error) {
      console.error('Error fetching Call for Papers:', error)
      return []
    }
  }

  useEffect(() => {
    getCallforpaper()
  }, [])

  return (
    <div className="home-counter-row">
      {cfpOpen.map((cfp) => (
        <Deadline
          key={cfp.id}
          title={cfp.title}
          deadlineAbstract={cfp.deadline_abstract}
          deadlineArticle={cfp.deadline_article}
        />
      ))}
      <PeerReviewCounter />
    </div>
  )
}

const Home = () => {
  const { t } = useTranslation()
  const { ordering } = useSorting()
  const { data: submittedAbstracts, fetchItems, setParams, reset } = useItemsStore()
  const isAbstractSubmitted = submittedAbstracts.length != 0

  useEffect(() => {
    reset()
    setParams({
      endpoint: 'abstracts',
      limit: 5,
      ordering: '-submitted_date',
      params: { status: 'SUBMITTED' },
      search: '',
    })
    fetchItems(true)
  }, [setParams, fetchItems, ordering])

  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <div className={`home-grid ${isAbstractSubmitted ? 'isAbstract' : ''}`}>
        <KPIRow />
        <>{isAbstractSubmitted && AbstractSubmittedCard(submittedAbstracts)}</>
        <CustomPieChart />
        <CustomBarChart />
      </div>
      <Outlet />
    </div>
  )
}

export default Home

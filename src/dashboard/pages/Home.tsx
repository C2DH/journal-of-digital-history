import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { Issue } from '../interfaces/issue'

import '../styles/pages/Home.css'
import '../styles/pages/pages.css'

const Home = () => {
  const { t } = useTranslation()
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issuesList = await fetchItems('/api/issues', USERNAME, PASSWORD)
        setIssues(issuesList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="home page">
      <h1>{t('welcome')}</h1>
      <Card
        item="issues"
        headers={['pid', 'name', 'creation_date', 'publication_date', 'status', 'volume', 'issue']}
        data={issues}
      />
      <Outlet />
    </div>
  )
}

export default Home

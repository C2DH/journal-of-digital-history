import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchIssues } from '../api/fetchData'
import Card from '../components/Card/Card'

import '../styles/LandingPage.css'

const LandingPage = () => {
  const { t } = useTranslation()
  const [issues, setIssues] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIssues()
        setIssues(data.results)
      } catch (error) {
        console.error('Error fetching issues:', error)
      }
    }
    fetchData()
  }, [])

  // Prepare headers and rows for the Card
    const headers = issues.length > 0
    ? Object.keys(issues[0]).filter(h => h !== 'description' && h !== 'cover_date'  && h !== 'is_open_ended')
    : [];

    const data = issues.map(issue =>
    headers.map(header => {
    const value = issue[header];
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    return value;
    })
    );

  return (
    <div className="landing-page">
      <h1>{t('welcome')}</h1>
      <Card title="Issues" headers={headers} data={data} />
    </div>
  )
}

export default LandingPage

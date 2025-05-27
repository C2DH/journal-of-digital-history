import { useEffect, useState } from 'react'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { Issue } from '../interfaces/issue'

import '../styles/pages/pages.css'

const Issues = () => {
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
    <div className="issues page">
      <Card
        item="issues"
        headers={['pid', 'name', 'creation_date', 'publication_date', 'status', 'volume', 'issue']}
        data={issues}
      />
    </div>
  )
}

export default Issues

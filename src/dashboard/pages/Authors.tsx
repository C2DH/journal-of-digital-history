import { useEffect, useState } from 'react'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { Issue } from '../interfaces/issue'

import '../styles/pages/pages.css'

const Authors = () => {
  const [authors, setAuthors] = useState<Issue[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsList = await fetchItems('/api/authors', USERNAME, PASSWORD)
        setAuthors(authorsList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="authors page">
      <Card
        item="authors"
        headers={['id', 'lastname', 'firstname', 'email', 'orcid', 'affiliation']}
        data={authors}
      />
    </div>
  )
}

export default Authors

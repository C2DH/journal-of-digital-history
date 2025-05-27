import { useEffect, useState } from 'react'

import { fetchItems } from '../api/fetchData'
import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { Abstract } from '../interfaces/abstract'

import '../styles/pages/pages.css'

const Articles = () => {
  const [articles, setArticles] = useState<Abstract[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesList = await fetchItems('/api/articles', USERNAME, PASSWORD)
        setArticles(articlesList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="articles page">
      <Card
        item="articles"
        headers={[
          'abstract.pid',
          'abstract.title',
          'callpaper',
          'submitted_date',
          'validation_date',
          'publication_date',
          'status',
          'repository_url',
        ]}
        data={articles}
      />
    </div>
  )
}

export default Articles

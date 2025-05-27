import { useEffect, useState } from 'react'

import ArticleKeywords from '../../components/Article/ArticleKeywords'
import { fetchItems } from '../api/fetchData'
import { USERNAME, PASSWORD } from '../constants/global'
import { Issue } from '../interfaces/issue'

import '../styles/pages/pages.css'

const Tags = () => {
  const [tags, setTags] = useState<Issue[]>([])
  console.log('🚀 ~ file: Tags.tsx:12 ~ tags:', tags)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsList = await fetchItems('/api/tags', USERNAME, PASSWORD)
        setTags(tagsList.results)
      } catch (error) {
        console.error('[Fetch Error]', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="tags page">
      <ArticleKeywords keywords={tags.map((tag) => tag.name)} />
    </div>
  )
}

export default Tags

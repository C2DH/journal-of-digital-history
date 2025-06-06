import { useEffect } from 'react'

import ArticleKeywords from '../../components/Article/ArticleKeywords'
import Loading from '../components/Loading/Loading'
import { useFetchItems } from '../hooks/useFetch'
import { Tag } from '../interfaces/tag'

import '../styles/pages/pages.css'
import '../../styles/components/Article/ArticleKeywords.css'

const Tags = () => {
  const { data: tags, error, loading, hasMore, loadMore } = useFetchItems<Tag>('/tags', 200)

  useEffect(() => {
    loadMore()
  }, [loadMore])

  if (loading && tags.length === 0) {
    return <Loading />
  }

  if (error) {
    return <div className="error">Error loading tags: {error}</div>
  }

  return (
    <div className="tags page">
      <ArticleKeywords keywords={tags.map((tag) => tag.name)} />
      {loading && tags.length > 0 && <Loading />}
    </div>
  )
}

export default Tags

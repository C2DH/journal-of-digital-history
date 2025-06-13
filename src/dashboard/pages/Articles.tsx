import { useNavigate } from 'react-router-dom'

import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { Article } from '../utils/types'

import '../styles/pages/pages.css'

const Articles = () => {
  const navigate = useNavigate()
  const { data: articles, error, loading, hasMore, loadMore } = useFetchItems<Article>('articles')

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
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  )
}

export default Articles

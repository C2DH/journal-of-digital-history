import Card from '../components/Card/Card'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Article } from '../interfaces/article'

import '../styles/pages/pages.css'

const Articles = () => {
  const {
    data: articles,
    error,
    loading,
  } = useFetchItems<Article>('/api/articles', USERNAME, PASSWORD)

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
      />
    </div>
  )
}

export default Articles

import ArticleKeywords from '../../components/Article/ArticleKeywords'
import { USERNAME, PASSWORD } from '../constants/global'
import { useFetchItems } from '../hooks/fetchData'
import { Tag } from '../interfaces/tag'

import '../styles/pages/pages.css'
import '../../styles/components/Article/ArticleKeywords.css'

const Tags = () => {
  const { data: tags, error, loading } = useFetchItems<Tag>('/api/tags', USERNAME, PASSWORD)

  return (
    <div className="tags page">
      <ArticleKeywords keywords={tags.map((tag) => tag.name)} />
    </div>
  )
}

export default Tags

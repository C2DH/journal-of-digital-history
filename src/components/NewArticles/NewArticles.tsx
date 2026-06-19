import './NewArticles.css'

import { useGetJSON } from '../../logic/api/fetchData'
import NewArticle from './NewArticle'

const NewArticles = ({ width }) => {
  const { data, error, status } = useGetJSON({
    url: `/api/articles/?limit=2&ordering=-publication_date&status=PUBLISHED`,
  })

  const articles = !error && status !== 'pending' ? (data?.results ?? []) : []

  return (
    <div className="homereel-newArticles" style={{ width: width, height: '180px' }}>
      {articles.map((article) => (
        <NewArticle key={article.id ?? article.abstract?.pid} article={article} />
      ))}
    </div>
  )
}

export default NewArticles

import './NewArticles.css'

import { useGetJSON } from '../../logic/api/fetchData'
import NewArticle from './NewArticle'

const NewArticles = () => {
  const { data, error, status } = useGetJSON({
    url: `/api/articles/?limit=2&ordering=-publication_date&status=PUBLISHED`,
  })

  const articles = data?.results ?? []

  if (status === 'pending') {
    return null
  }

  if (error) {
    return null
  }

  return (
    <div className="homereel-newArticles">
      {articles.map((article) => (
        <NewArticle key={article.id ?? article.abstract?.pid} article={article} />
      ))}
    </div>
  )
}

export default NewArticles

import './NewArticles.css'

import { useEffect, useState } from 'react'

import NewArticle from './NewArticle'

const NewArticles = async ({ width }) => {
  type Article = React.ComponentProps<typeof NewArticle>['article']
  const [articles, setArticles] = useState<Article[]>([])

  const url = `/api/articles/?limit=2&ordering=-publication_date&status=PUBLISHED`

  useEffect(() => {
    const getNewArticles = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        return setArticles(data?.results ?? [])
      } catch (error) {
        return error
      }
    }
    getNewArticles()
  }, [])

  return (
    <>
      {' '}
      <div className="homereel-newArticles" style={{ width: width, height: '180px' }}>
        {articles.map((article, index) => (
          <NewArticle key={index} article={article} />
        ))}
      </div>
    </>
  )
}

export default NewArticles

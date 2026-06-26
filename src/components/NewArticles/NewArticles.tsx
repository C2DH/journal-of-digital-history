import './NewArticles.css'

import { Skeleton } from '@mui/joy'
import { useEffect, useState } from 'react'

import NewArticle from './NewArticle'

const NewArticles = ({ width }) => {
  type Article = React.ComponentProps<typeof NewArticle>['article']
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const url = `/api/articles/?limit=2&ordering=-publication_date&status=PUBLISHED`

  useEffect(() => {
    const controller = new AbortController()

    const getNewArticles = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal })
        const data = await response.json()
        setArticles(data?.results ?? [])
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error(error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    getNewArticles()
    return () => controller.abort()
  }, [url])

  return (
    <div className="homereel-newArticles" style={{ width, height: '180px' }}>
      {' '}
      {isLoading
        ? Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="new-article-skeleton"
              style={{ display: 'Flex', flexDirection: 'row' }}
            >
              <Skeleton variant="circular" />
              <Skeleton variant="rounded" />
            </div>
          ))
        : articles.map((article) => (
            <NewArticle key={article.abstract?.pid} article={article} />
          ))}{' '}
    </div>
  )
}

export default NewArticles

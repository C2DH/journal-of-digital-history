import './NewArticles.css'

import { useState } from 'react'

import { useIsTablet } from '../../dashboard/hooks/useIsMobile'
import { useGetJSON } from '../../logic/api/fetchData'
import NewArticle from './NewArticle'

const NewArticles = ({ width }) => {
  const [isTablet, setIsTablet] = useState(false)
  const { data, error, status } = useGetJSON({
    url: `/api/articles/?limit=${isTablet ? 1 : 2}&ordering=-publication_date&status=PUBLISHED`,
  })

  const articles = !error && status !== 'pending' ? (data?.results ?? []) : []

  useIsTablet(setIsTablet)

  return (
    <>
      {' '}
      <div className="homereel-newArticles" style={{ width: width, height: '180px' }}>
        {articles.map((article) => (
          <NewArticle key={article.abstract?.pid} article={article} />
        ))}
      </div>
    </>
  )
}

export default NewArticles

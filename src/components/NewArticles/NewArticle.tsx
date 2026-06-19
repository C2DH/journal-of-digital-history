import './NewArticle.css'

import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'

import { NewArticleCardProps } from './interface'

import { useBoundingClientRect } from '../../hooks/graphics'
import ArticleFingerprint from '../Article/ArticleFingerprint'

const Separator = () => {
  return <span className="separator">•</span>
}

const NewArticle = ({ article }: NewArticleCardProps) => {
  const navigate = useNavigate()
  const [{ width: size }, ref] = useBoundingClientRect()

  const parsedDate = DateTime.fromISO(article.publication_date)
  const pubDate = parsedDate.isValid ? parsedDate.setLocale('en').toFormat('dd LLL yyyy') : ''

  const handleClick = () => {
    navigate(`/en/article/${article.abstract?.pid}`)
  }

  return (
    <div className="container-newArticle HomeReel_item" onClick={handleClick}>
      <div className="container-newArticle-fingerprint" ref={ref}>
        <ArticleFingerprint
          stats={article.fingerprint?.stats}
          cells={article.fingerprint?.cells}
          size={size > 0 ? size : 150}
        />
      </div>
      <div className="container-newArticle-text">
        <h4>{article.abstract.title}</h4>
        <p>
          {`${article.abstract.contact_firstname} ${article.abstract.contact_lastname}`}
          <Separator />
          {pubDate}
          <Separator />
          {`Issue n.${article.issue.pid.slice(-1)}`}
        </p>
      </div>
    </div>
  )
}

export default NewArticle

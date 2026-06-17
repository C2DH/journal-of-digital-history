import './NewArticle.css'

import { DateTime } from 'luxon'

import { NewArticleCardProps } from './interface'

import { useBoundingClientRect } from '../../hooks/graphics'
import ArticleFingerprint from '../Article/ArticleFingerprint'

const NewArticle = ({ article }: NewArticleCardProps) => {
  const [{ width: size }, ref] = useBoundingClientRect()

  const parsedDate = DateTime.fromISO(article.publication_date)
  const pubDate = parsedDate.isValid ? parsedDate.setLocale('en').toFormat('dd LLL yyyy') : ''

  return (
    <div className="container-newArticle">
      <div className="container-newArticle-fingerprint" ref={ref}>
        <ArticleFingerprint
          stats={article.fingerprint?.stats}
          cells={article.fingerprint?.cells}
          size={230}
        />
      </div>
      <div className="container-newArticle-text">
        <h4>{article.abstract.title}</h4>
        <span>{`${article.abstract.contact_firstname} ${article.abstract.contact_lastname}`}</span>{' '}
        •<span>{pubDate}</span> •<span>{`Issue n.${article.issue.pid.slice(-1)}`}</span>
      </div>
    </div>
  )
}

export default NewArticle

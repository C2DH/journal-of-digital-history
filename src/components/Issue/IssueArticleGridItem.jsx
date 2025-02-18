import React from 'react'
import { useTranslation } from 'react-i18next'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import ArticleKeywords from '../Article/ArticleKeywords'
import ArticleCellContent from '../Article/ArticleCellContent'
import LangLink from '../LangLink'
import { Badge } from 'react-bootstrap'
import { useBoundingClientRect } from '../../hooks/graphics'
import { extractMetadataFromArticle, stripHtml } from '../../logic/api/metadata'
import { IsMobile, IsPrettyRecentTagName } from '../../constants'
import '../../styles/components/IssueArticleGridItem.scss'
import { ArrowRightCircle } from 'react-feather'
import IssueLabel from './IssueLabel'

const IssueArticleGridItem = ({
  article = {},
  isFake = false,
  // num = 0,
  isEditorial,
  onMouseMove,
  onMouseOut,
  onClick,
  onKeywordClick,
}) => {
  const [{ width: size }, ref] = useBoundingClientRect()
  const { title, keywords, excerpt, contributor } = extractMetadataFromArticle(article)
  const { t } = useTranslation()
  const isPrettyRecent = article.tags.some((d) => d.name === IsPrettyRecentTagName)

  return (
    <div
      className={`IssueArticleGridItem ${isPrettyRecent ? 'just-added' : ''}`}
      onMouseOut={onMouseOut}
      ref={ref}
    >
      <div
        className={IsMobile ? 'half-squared' : 'squared'}
        onMouseOut={onMouseOut}
        style={{
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      >
        <ArticleFingerprint
          onMouseMove={onMouseMove}
          onClick={onClick}
          stats={article.fingerprint?.stats}
          cells={article.fingerprint?.cells}
          size={IsMobile ? size / 2 : size}
        />
      </div>
      {isEditorial && (
        <Badge bg="secondary" className="rounded me-2">
          {t('editorial')}
        </Badge>
      )}
      <Badge bg="transparent" className="rounded border text-dark">
        <IssueLabel publication_date={article.issue.publication_date} pid={article.issue.pid} />
      </Badge>
      {article.publication_date ? (
        <div className="IssueArticleGridItem_date">
          {t('dates.short', { date: new Date(article.publication_date) })}
        </div>
      ) : (
        ''
      )}
      <h3>
        <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`}>
          {title.map(({ content }, i) => (
            <span key={i}>{stripHtml(content)}</span>
          ))}
        </LangLink>
      </h3>
      {contributor.map(({ content }, i) => (
        <React.Fragment key={i}>
          <ArticleCellContent
            className="IssueArticleGridItem_contributor"
            key={i}
            content={content}
            hideIdx
            hideNum
          />
          {i < contributor.length - 1 && ', '}
        </React.Fragment>
      ))}

      <ArticleKeywords onKeywordClick={onKeywordClick} className="mt-3" keywords={keywords} />
      <blockquote className="IssueArticleGridItem_excerpt d-none d-md-flex ">
        <span
          dangerouslySetInnerHTML={{
            __html: excerpt,
          }}
        ></span>
        <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`} className="ms-2">
          <ArrowRightCircle size={18} />
        </LangLink>
      </blockquote>
    </div>
  )
}

export default IssueArticleGridItem

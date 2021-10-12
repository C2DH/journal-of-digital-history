import React from 'react'
import { useTranslation } from 'react-i18next'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import ArticleKeywords from '../Article/ArticleKeywords'
import ArticleCellContent from '../Article/ArticleCellContent'
import LangLink from '../LangLink'
import { Badge } from 'react-bootstrap'
import {useBoundingClientRect} from '../../hooks/graphics'
import { extractMetadataFromArticle, stripHtml } from '../../logic/api/metadata'
import { isMobile } from 'react-device-detect'
import '../../styles/components/IssueArticleGridItem.scss'


const IssueArticleGridItem = ({ article={}, isFake=false, num=0, total=1, isEditorial }) => {
  const [{width: size }, ref] = useBoundingClientRect()
  const { title, keywords, excerpt, contributor } = extractMetadataFromArticle(article)
  const { t } = useTranslation()
  return (
    <div className="IssueArticleGridItem" ref={ref}>
      <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`}>
        <div className="squared" style={{
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}>
          <ArticleFingerprint stats={article.fingerprint?.stats}  cells={article.fingerprint?.cells}
            size={size}/>
        </div>
        {isEditorial ? <Badge bg="secondary">{t('editorial')}</Badge>: num}
        <h3 className="d-block mt-1 pb-0">
          {title.map(({content}, i) => (
            <ArticleCellContent key={i} content={stripHtml(content)} hideIdx hideNum/>
          ))}
        </h3>
        <div className="mb-2">
        {contributor.map(({content},i) => (
          <ArticleCellContent className="IssueArticleGridItem_contributor" key={i} content={content} hideIdx hideNum/>
        ))}
        </div>
        <ArticleKeywords keywords={keywords}/>
        <blockquote className="d-none d-md-block" dangerouslySetInnerHTML={{
          __html: excerpt
        }} />
      </LangLink>
    </div>
  )
}


export default IssueArticleGridItem

import React from 'react'
import { useTranslation } from 'react-i18next'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import ArticleKeywords from '../Article/ArticleKeywords'
import ArticleCellContent from '../Article/ArticleCellContent'
import LangLink from '../LangLink'
import { Badge } from 'react-bootstrap'
import {useBoundingClientRect} from '../../hooks/graphics'
import { extractMetadataFromArticle, stripHtml } from '../../logic/api/metadata'
import { IsMobile } from '../../constants'
import '../../styles/components/IssueArticleGridItem.scss'


const IssueArticleGridItem = ({ article={}, isFake=false, num=0, isEditorial }) => {
  const [{width: size }, ref] = useBoundingClientRect()
  const { title, keywords, excerpt, contributor } = extractMetadataFromArticle(article)
  const { t } = useTranslation()
  return (
    <div className="IssueArticleGridItem" ref={ref}>
        <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`}>
        <div className={IsMobile ? 'half-squared': 'squared'} style={{
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}>
          <ArticleFingerprint stats={article.fingerprint?.stats}  cells={article.fingerprint?.cells}
            size={IsMobile ? size/2 : size}/>
        </div>
        </LangLink>
        {isEditorial ? <Badge bg="secondary" className="rounded">{t('editorial')}</Badge>: num}
        <h3 className="d-block mt-1 pb-0">
          <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`}>
          {title.map(({content}, i) => (
            <ArticleCellContent key={i} content={stripHtml(content)} hideIdx hideNum/>
          ))}
          </LangLink>
        </h3>

        {contributor.map(({content},i) => (
          <ArticleCellContent className="IssueArticleGridItem_contributor" key={i} content={content} hideIdx hideNum/>
        ))}

        <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`} className="mb-2">

        <ArticleKeywords keywords={keywords}/>
        <blockquote className="d-none d-md-block" dangerouslySetInnerHTML={{
          __html: excerpt
        }} />
        </LangLink>
    </div>
  )
}


export default IssueArticleGridItem

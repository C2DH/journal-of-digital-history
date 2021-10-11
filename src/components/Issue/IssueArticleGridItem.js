import React from 'react'
import { useTranslation } from 'react-i18next'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import ArticleKeywords from '../Article/ArticleKeywords'
import ArticleCellContent from '../Article/ArticleCellContent'
import LangLink from '../LangLink'
import {useBoundingClientRect} from '../../hooks/graphics'
import { extractMetadataFromArticle, stripHtml } from '../../logic/api/metadata'

const IssueArticleGridItem = ({ article={}, isFake=false, num=0, isEditorial }) => {
  const [{width: size }, ref] = useBoundingClientRect()
  const { title, keywords, excerpt, contributor } = extractMetadataFromArticle(article)
  const { t } = useTranslation()
  return (
    <div className="IssueArticleGridItem mt-5" ref={ref}>
      <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`}>
        <div className="squared" style={{
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}>
          <ArticleFingerprint stats={article.fingerprint?.stats}  cells={article.fingerprint?.cells}
            size={size}/>
        </div>
        <div className="monospace">
          {isEditorial ? <b>{t('editorial')}</b> : num}
        </div>
        <h3 className="d-block mt-1 pb-0" style={{textDecoration: 'underline'}}>
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
        <blockquote dangerouslySetInnerHTML={{
          __html: excerpt
        }} />
      </LangLink>
    </div>
  )
}


export default IssueArticleGridItem

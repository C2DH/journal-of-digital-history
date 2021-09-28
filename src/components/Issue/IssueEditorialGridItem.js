import React from 'react'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import ArticleKeywords from '../Article/ArticleKeywords'
import LangLink from '../LangLink'
import {useBoundingClientRect} from '../../hooks/graphics'
import { extractMetadataFromArticle, extractExcerpt, stripHtml } from '../../logic/api/metadata'

const IssueEditorialGridItem = ({ article={} }) => {
  const [{width: size }, ref] = useBoundingClientRect()
  const { title, keywords, abstract, contributors } = extractMetadataFromArticle(article)
  return (
    <div className="IssueEditorialGridItem mt-5" ref={ref}>
      <LangLink to={`/article/${article.abstract.pid}`}>
        <div className="squared  position-relative" style={{
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}>
          <ArticleFingerprint stats={article.fingerprint?.stats}  cells={article.fingerprint?.cells} size={size}/>
        </div>
        <h3 className="d-block mt-3 pb-0" style={{textDecoration: 'underline'}}>
          {stripHtml(title)}
        </h3>
        <p><span className="badge">EDITORIAL</span></p>
        <ArticleKeywords keywords={keywords}/>
        <blockquote dangerouslySetInnerHTML={{
          __html: extractExcerpt(abstract)
        }} />
        {contributors.map((d,i) => (<span key={i}>{stripHtml(d)}</span>))}
      </LangLink>
    </div>
  )
}


export default IssueEditorialGridItem

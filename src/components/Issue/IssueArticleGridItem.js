import React from 'react'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import ArticleKeywords from '../Article/ArticleKeywords'
import LangLink from '../LangLink'
import {useBoundingClientRect} from '../../hooks/graphics'
import { extractMetadataFromArticle, extractExcerpt, stripHtml } from '../../logic/api/metadata'

const IssueArticleGridItem = ({ article={}, isFake=false, num=0 }) => {
  const [{width: size }, ref] = useBoundingClientRect()
  const { title, keywords, abstract, contributors } = extractMetadataFromArticle(article)
  return (
    <div className="IssueArticleGridItem mt-5" ref={ref}>
      <LangLink to={isFake ? '#' : `/article/${article.abstract.pid}`}>
        <div className="squared  position-relative" style={{
          backgroundColor: 'transparent',
          overflow: 'hidden'
        }}>
          <ArticleFingerprint stats={article.fingerprint?.stats}  cells={article.fingerprint?.cells} size={size}/>
        </div>
        <div className="monospace"> {num}</div>
        <h3 className="d-block mt-3 pb-0" style={{textDecoration: 'underline'}}>
          {stripHtml(title)}
        </h3>
        <p>{article.status}</p>
        <ArticleKeywords keywords={keywords}/>
        <blockquote dangerouslySetInnerHTML={{
          __html: extractExcerpt(abstract)
        }} />
        {contributors.map((d,i) => (<div className="IssueArticleGridItem_contributor" key={i} dangerouslySetInnerHTML={{__html: d}}/>))}
      </LangLink>
    </div>
  )
}


export default IssueArticleGridItem

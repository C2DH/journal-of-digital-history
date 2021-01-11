import React, { lazy } from 'react';
import styles from './ArticleText.module.scss'
import ArticleCellOutput from './ArticleCellOutput'

const ArticleCellVisualisation = lazy(() => import('./ArticleCellVisualisation'))


const ArticleCell = ({
  type, content='', idx, outputs=[], hideIdx, metadata = {},
  progress, active = false,
  ...props
}) => {
  if (type === 'markdown') {
    if (metadata.jdh?.scope === 'visualisation') {
      return <ArticleCellVisualisation metadata={metadata} progress={progress} active={active}/>
    }
    return (
      <>
      <div className={styles.ArticleCell} id={`P${idx}`}>
        {!hideIdx && (<div className={styles.ParagraphNumber}>{idx}</div>)}
        <div dangerouslySetInnerHTML={{__html: content}}></div>
      </div>

      </>
    )
  }
  if (type === 'code') {
    return (
      <div className={styles.ArticleCell} id={`P${idx}`}>
        {!hideIdx && (<div className={styles.ParagraphNumber}>{idx}</div>)}
        <pre className="bg-dark text-white p-3">{content}</pre>
        {outputs.length
          ? outputs.map((output,i) => <ArticleCellOutput output={output} key={i} />)
          : <div>no output</div>
        }
      </div>
    )
  }
  return (<div>unknown type: {type}</div>)
}

export default ArticleCell

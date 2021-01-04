import React from 'react';
import styles from './ArticleText.module.scss'


const ArticleCell = ({ type, content='', idx, outputs=[], hideIdx, ...props }) => {
  if (type === 'markdown') {
    return (
      <div className={styles.ArticleCell} id={`P${idx}`}>
        {!hideIdx && (<div className={styles.ParagraphNumber}>{idx}</div>)}
        <div dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    )
  }
  if (type === 'code') {
    return (
      <div className={styles.ArticleCell} id={`P${idx}`}>
        {!hideIdx && (<div className={styles.ParagraphNumber}>{idx}</div>)}
        <pre className="bg-dark text-white p-3">{content}</pre>
        <pre>{JSON.stringify(outputs)}</pre>
        {outputs.length && outputs.map((output,i) => {
          return (
            <blockquote key={i} className='pl-3 py-2 pr-2' style={{borderLeft: '2px solid', background:'var(--gray-200)'}}>
              <div>{output.output_type} {output.ename}</div>
              <div>{output.evalue}</div>
            </blockquote>
          )
        })}
      </div>
    )
  }
  return (<div>unknown type: {type}</div>)
}

export default ArticleCell

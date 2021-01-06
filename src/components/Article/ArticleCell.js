import React from 'react';
import styles from './ArticleText.module.scss'

const ArticleCellOutput = ({ output }) => {
  const outputTypeClassName= `ArticleCellOutput_${output.output_type}`
  return (
    <blockquote className={`${outputTypeClassName}`}>
      <div>
        <div className="label">type:{output.output_type} | name:{output.name}</div>
      </div>
      {output.output_type === 'stream' && (
        <pre>{output.text.join('\n')}</pre>
      )}
      {output.output_type === 'execute_result' && output.data['text/plain'] && (
        <pre>{output.data['text/plain'].join('')}</pre>
      )}
      {output.output_type === 'display_data' && output.data['text/plain'] && (
        <pre>{output.data['text/plain'].join('')}</pre>
      )}
      {output.output_type === 'display_data' && output.data['image/png'] && (
        <img src={`data:image/png;base64,${output.data['image/png']}`} alt='display_data output'/>
      )}
    </blockquote>
  )
}

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

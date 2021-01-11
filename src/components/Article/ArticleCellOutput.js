import React from 'react'


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

export default ArticleCellOutput

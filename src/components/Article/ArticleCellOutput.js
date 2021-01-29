import React from 'react'

const getOutput = (output) => {
  return Array.isArray(output)
    ? output.join(' ')
    : output
}

const ArticleCellOutput = ({ output }) => {
  const outputTypeClassName= `ArticleCellOutput_${output.output_type}`
  return (
    <blockquote className={`${outputTypeClassName}`}>
      <div>
        <div className="label">type:{output.output_type} | name:{output.name}</div>
      </div>
      {output.output_type === 'stream' && (
        <pre>{Array.isArray(output.text) ? output.text.join('\n') : output.text}</pre>
      )}
      {output.output_type === 'execute_result' && output.data['text/plain'] && (
        <pre>{getOutput(output.data['text/plain'])}</pre>
      )}
      {output.output_type === 'display_data' && output.data['text/plain'] && (
        <pre>{getOutput(output.data['text/plain'])}</pre>
      )}
      {!!output.data['image/png'] && (
        <img src={`data:image/png;base64,${output.data['image/png']}`} alt='display_data output'/>
      )}
      {!!output.data['image/jpeg'] && (
        <img src={`data:image/jpeg;base64,${output.data['image/jpeg']}`} alt='display_data output'/>
      )}
    </blockquote>
  )
}

export default ArticleCellOutput

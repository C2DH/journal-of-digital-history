import React from 'react'
import { useTranslation } from 'react-i18next'

const getOutput = (output) => {
  return Array.isArray(output)
    ? output.join(' ')
    : output
}

const ArticleCellOutput = ({ output, hideLabel=false }) => {
  const outputTypeClassName= `ArticleCellOutput_${output.output_type}`
  const { t } = useTranslation()

  return (
    <blockquote className={`${outputTypeClassName}`}>
      {hideLabel ? null :(
        <div>
          <div className="label">{t(outputTypeClassName)}</div>
        </div>
      )}
      {output.output_type === 'stream' && (
        <details>
          <summary>...</summary>
        <pre>{Array.isArray(output.text) ? output.text.join('') : output.text}</pre>
        </details>
      )}
      {output.output_type === 'execute_result' && output.data['text/plain'] && (
        <pre>{getOutput(output.data['text/plain'])}</pre>
      )}
      {!hideLabel && output.output_type === 'display_data' && output.data['text/plain'] && (
        <pre>{getOutput(output.data['text/plain'])}</pre>
      )}
      {!!output.data && !!output.data['image/png'] && (
        <img src={`data:image/png;base64,${output.data['image/png']}`} alt='display_data output'/>
      )}
      {!!output.data && !!output.data['image/jpeg'] && (
        <img src={`data:image/jpeg;base64,${output.data['image/jpeg']}`} alt='display_data output'/>
      )}
    </blockquote>
  )
}

export default ArticleCellOutput

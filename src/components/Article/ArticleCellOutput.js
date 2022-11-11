import React from 'react'
import { useTranslation } from 'react-i18next'
import { markdownParser } from '../../logic/ipynb'
import ArticleCellOutputPlugin from './ArticleCellOutputPlugin'

const getOutput = (output) => {
  return Array.isArray(output) ? output.join(' ') : output
}

const ArticleCellOutput = ({
  output,
  height,
  width,
  hideLabel = false,
  isJavascriptTrusted = false,
  cellIdx = -1,
}) => {
  const outputTypeClassName = `ArticleCellOutput_${output.output_type}`
  const { t } = useTranslation()
  let style = !isNaN(height)
    ? !isNaN(width)
      ? {
          // constrain output to this size. used for images.
          width,
          height,
        }
      : {
          height,
          objectFit: 'scale-down',
          display: 'block',
          margin: '0 auto',
          // background: '#0000000c',
          // border: '2px solid #0000000c',
          // backgroundClip: 'content-box',
        }
    : {}
  style = null

  if (output.output_type === 'display_data' && output.data['text/markdown']) {
    return (
      <div
        className={`ArticleCellOutput ${outputTypeClassName}`}
        // style={style}
        dangerouslySetInnerHTML={{
          __html: markdownParser.render(getOutput(output.data['text/markdown'])),
        }}
      />
    )
  }
  if (['execute_result', 'display_data'].includes(output.output_type) && output.data['text/html']) {
    if (isJavascriptTrusted) {
      // use DOM directly to handle this
      return (
        <ArticleCellOutputPlugin
          cellIdx={cellIdx}
          trustedInnerHTML={getOutput(output.data['text/html'])}
        />
      )
    }
    return (
      <div
        className={`ArticleCellOutput withHTML mb-3 ${outputTypeClassName} ${
          isJavascriptTrusted ? 'withJS' : 'noJS'
        }`}
        dangerouslySetInnerHTML={{
          __html: getOutput(output.data['text/html']),
        }}
      />
    )
  }

  const encodedImages = Object.keys(output.data)
    .filter((mimetype) => mimetype.indexOf('image/') === 0)
    .map((mimetype) => `data:${mimetype};base64,${output.data[mimetype]}`)

  return (
    <blockquote className={`${outputTypeClassName}`}>
      {hideLabel ? null : (
        <div>
          <div className="label">{t(outputTypeClassName)}</div>
        </div>
      )}
      {output.output_type === 'error' && (
        <pre style={{ whiteSpace: 'pre-wrap' }} className=" hljs d-block bg-dark text-white">
          {JSON.stringify(output, null, 2)}
        </pre>
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
      {encodedImages.map((src, i) => (
        <img key={i} style={style} src={src} alt="display_data output" />
      ))}
    </blockquote>
  )
}

export default ArticleCellOutput

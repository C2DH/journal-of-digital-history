import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {markdownParser} from '../../logic/ipynb'
import ArticleCellOutputPlugin from './ArticleCellOutputPlugin'

const getOutput = (output) => {
  return Array.isArray(output)
    ? output.join(' ')
    : output
}

const ArticleCellOutput = ({ output, height, width, hideLabel=false, isTrusted=true, cellId='' }) => {
  const outputTypeClassName= `ArticleCellOutput_${output.output_type}`
  const { t } = useTranslation()
  const style = !isNaN(width) && !isNaN(height) ? {
    // constrain output to this size. used for images.
    width,
    height,
  } : {}
  const trustedScripts = !!output.data && isTrusted && Array.isArray(output.data['application/javascript'])
    ? output.data['application/javascript']
    : []
  // apply scripts if found on data.
  useEffect(() => {
    if (!trustedScripts.length) {
      return
    }
    const scriptDomElementId = 'trusted-article-cell-output-' + cellId
    let scriptDomElement = document.getElementById(scriptDomElementId)
    if (scriptDomElement === null) {
      const script = document.createElement('script');
      script.setAttribute('id', scriptDomElementId)
      document.body.appendChild(script)
    } else {
      // replace contents of the script
      scriptDomElement.appendChild(document.createTextNode(trustedScripts.join('\n')));
    }
    return () => {
      try {
      document.body.removeChild(scriptDomElement)
      } catch(e) {
        console.warn('document.body.removeChild failed for ', cellId, e.message)
      }
    }
  }, [trustedScripts])

  if(output.output_type === 'display_data' && output.data['text/markdown']) {
    return (
      <div className={`ArticleCellOutput ${outputTypeClassName}`} style={style} dangerouslySetInnerHTML={{
        __html: markdownParser.render(getOutput(output.data['text/markdown']))
      }}/>
    )
  }
  if (['execute_result', 'display_data'].includes(output.output_type) && output.data['text/html']) {
    if (trustedScripts) {
      // use DOM to handle this
      return <ArticleCellOutputPlugin trustedInnerHTML={getOutput(output.data['text/html'])} />
    }
    return (<div className={`ArticleCellOutput withHTML mb-3 ${outputTypeClassName}`} style={style} dangerouslySetInnerHTML={{
      __html: getOutput(output.data['text/html'])
    }} />)
  }

  return (
    <blockquote style={style} className={`${outputTypeClassName}`}>
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
      {!!output.data && !!output.data['image/gif'] && (
        <img src={`data:image/gif;base64,${output.data['image/gif']}`} alt='display_data output'/>
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

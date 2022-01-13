import React from 'react'
import ArticleCellOutput from './ArticleCellOutput'
import { useInjectTrustedJavascript } from '../../hooks/graphics'

const ArticleCellOutputs = ({
  isJavascriptTrusted,
  outputs=[],
  cellIdx,
  hideLabel,
}) => {
  // use scripts if there areany
  const trustedScripts =  isJavascriptTrusted ? outputs.reduce((acc, output) => {
    if (typeof output.data === 'object') {
      if (Array.isArray(output.data['application/javascript'])) {
        return acc.concat(output.data['application/javascript'])
      }
    }
    return acc
  }, []): []

  const refTrustedJavascript = useInjectTrustedJavascript({
    id: `trusted-script-for-${cellIdx}`,
    contents: trustedScripts,
    isTrusted: isJavascriptTrusted
  })

  return (
    <div className="ArticleCellOutputs" ref={refTrustedJavascript}>
      {outputs.map((output,i) => (
        <ArticleCellOutput
          hideLabel={hideLabel}
          isJavascriptTrusted={false}
          cellIdx={cellIdx}
          output={output}
          key={i}
        />
      ))}
    </div>
  )
}

export default ArticleCellOutputs

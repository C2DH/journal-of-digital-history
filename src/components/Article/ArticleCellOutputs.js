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
      } else if (Array.isArray(output.data['text/html'])) {
        // view if there are any candidate
        if (output.data['text/html'].some(d => d.indexOf('/script>'))) {
          // we should alert somehow.
          const htmlScript = output.data['text/html'].join('').match(/(?<=(\x3Cscript[^>]*>))([\s\S]*?)\x3C\/script>/m)
          if (htmlScript) {
            console.debug('[ArticleCellOutputs] cellIdx:', cellIdx, 'contains:', htmlScript[2])
            return acc.concat(htmlScript[2])
          }
        }
        // // eslint-disable-next-line
        // debugger
        // output.data['text/html'].match('\x3Cscript')
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

import React, { Suspense } from 'react'

const ArticleCellMagicIframeOutputs = React.lazy(() => import('./ArticleCellMagicIframeOutputs'))
const ArticleCellOutputsAsIframe = React.lazy(() => import('./ArticleCellOutputsAsIframe'))
const ArticleCellJavascriptOutputs = React.lazy(() => import('./ArticleCellJavascriptOutputs'))

const SupportedVndMimeTypes = [
  'application/vnd.plotly.v1+json',
  'application/vnd.vega.v4+json',
  'application/vnd.vegalite.v2+json',
]

const ArticleCellOutputs = ({
  isMagic = false,
  isolationMode = false,
  isJavascriptTrusted = false,
  outputs = [],
  cellIdx,
  hideLabel,
  height,
}) => {
  // get the full list of vnd mime types
  const vndMimeTypes = outputs
    .reduce((acc, output) => {
      if (typeof output.data === 'object') {
        return acc.concat(
          Object.keys(output.data).filter(
            (mimeType) => mimeType.indexOf('application/vnd.') !== -1,
          ),
        )
      }
      return acc
    }, [])
    // we can remove this filtering as soon as we know that all vnd mime types are supported
    .filter((mimeType) => SupportedVndMimeTypes.indexOf(mimeType) !== -1)

  if (isolationMode || vndMimeTypes.length) {
    return (
      <Suspense fallback={<div style={{ height }}>Loading...</div>}>
        <ArticleCellOutputsAsIframe
          isJavascriptTrusted={isJavascriptTrusted}
          isolationMode={isolationMode}
          outputs={outputs}
          cellIdx={cellIdx}
          hideLabel={hideLabel}
          height={height}
          vndMimeTypes={vndMimeTypes}
        />
      </Suspense>
    )
  }

  // use iframe to render magic stuff (starting with %%javascript)
  if (isMagic) {
    return (
      <Suspense fallback={<div style={{ height }}>Loading...</div>}>
        <ArticleCellMagicIframeOutputs
          isJavascriptTrusted={isJavascriptTrusted}
          outputs={outputs}
          cellIdx={cellIdx}
          hideLabel={hideLabel}
          height={height}
        />
      </Suspense>
    )
  } else {
    return (
      <Suspense fallback={<div style={{ height }}>Loading...</div>}>
        <ArticleCellJavascriptOutputs
          isJavascriptTrusted={isJavascriptTrusted}
          outputs={outputs}
          cellIdx={cellIdx}
          hideLabel={hideLabel}
          height={height}
        />
      </Suspense>
    )
  }
}

export default ArticleCellOutputs

/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellSourceCode from '../Article/ArticleCellSourceCode'
import {
  BootstrapColumLayout,
  BootstrapNarrativeStepColumnLayout,
  ArticleCellContainerClassNames,
} from '../../constants'
import { useThebeSession } from 'thebe-react'

const ArticleCell = ({
  type,
  layer,
  num = 1,
  content = '',
  idx,
  outputs = [],
  hideNum,
  metadata = {},
  isNarrativeStep,
  headingLevel = 0, // if isHeading, set this to its ArticleHeading.level value
  isJavascriptTrusted = false,
  onNumClick,
  thebeCell,
  useThebeRendering,
  notebookIsExecuting,
}) => {
  const { ready, session } = useThebeSession()

  const [results, setResults] = React.useState(outputs)
  const [error, setError] = React.useState(undefined)
  const [executing, setExecuting] = React.useState(false)
  const busy = executing || notebookIsExecuting

  const executeCell = useCallback(() => {
    if (thebeCell) {
      setExecuting(true)
      thebeCell.execute().then((result) => {
        console.log('ArticleCell executeCell', result)
        setExecuting(false)
        // errors is an array of https://nbformat.readthedocs.io/en/latest/format_description.html#error
        // they will also be displayed in the cell output
        if (result.error) setError(result.error)
        if (!useThebeRendering) {
          setResults(thebeCell.outputs)
        }
      })
    }
  }, [thebeCell])

  const ref = useCallback(
    (node) => {
      if (useThebeRendering && thebeCell && node && ready) {
        const verb = thebeCell.isAttachedToDOM ? 'reattaching' : 'attaching'
        console.debug(`${verb} cell ${thebeCell.id} to DOM at:`, {
          el: node,
          connected: node.isConnected,
        })

        thebeCell.attachToDOM(node)
      }
    },
    [ready, session, useThebeRendering, thebeCell],
  )

  let cellBootstrapColumnLayout = metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayout
  // we override or set the former layout if it appears in narrative-step
  if (isNarrativeStep) {
    cellBootstrapColumnLayout = BootstrapNarrativeStepColumnLayout
  }

  const containerClassNames = (metadata.tags ?? []).filter((d) =>
    ArticleCellContainerClassNames.includes(d),
  )

  if (type === 'markdown') {
    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout}>
            <ArticleCellContent
              headingLevel={headingLevel}
              onNumClick={onNumClick}
              hideNum={hideNum}
              layer={layer}
              content={content}
              idx={idx}
              num={num}
            />
          </Col>
        </Row>
      </Container>
    )
  }
  if (type === 'code') {
    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout}>
            <div className="ArticleCellContent">
              <div className="ArticleCellContent_num"></div>
              <div style={{ position: 'relative' }}>
                {ready && (
                  <div
                    style={{
                      color: error ? 'white' : 'inherit',
                      backgroundColor: error ? 'red' : 'lightgreen',
                      paddingLeft: 4,
                      paddingRight: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <div>cell {error ? 'error' : 'ready'}</div>
                    <div style={{ flexGrow: 1 }} />
                    <button onClick={executeCell} disabled={busy}>
                      run
                    </button>
                    <button onClick={() => setResults([])} disabled={busy}>
                      clear
                    </button>
                  </div>
                )}
                <ArticleCellSourceCode visible content={content} language="python" />
                <div ref={ref}>
                  <ArticleCellOutputs
                    isMagic={false}
                    isolationMode={false}
                    isJavascriptTrusted={isJavascriptTrusted}
                    cellIdx={idx}
                    outputs={results}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
  return <div>unknown type: {type}</div>
}

export default ArticleCell

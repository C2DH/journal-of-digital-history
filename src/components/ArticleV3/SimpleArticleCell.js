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
import { useExecutionScope } from './ExecutionScope'

const ArticleCell = ({
  type,
  layer,
  num = 1,
  content = '',
  idx,
  hideNum,
  metadata = {},
  isNarrativeStep,
  headingLevel = 0, // if isHeading, set this to its ArticleHeading.level value
  isJavascriptTrusted = false,
  onNumClick,
  renderUsingThebe,
  ready,
}) => {
  const { executing, error, outputs, thebeCell, executeCell, clearCell, resetCell } =
    useExecutionScope((state) => ({
      executing: state.cells[idx]?.executing ?? false,
      error: state.cells[idx]?.error,
      outputs: state.cells[idx]?.outputs ?? [],
      thebeCell: state.cells[idx]?.thebe,
      executeCell: () => state.executeCell(idx), // curried to this cell idx
      clearCell: () => state.clearCell(idx),
      resetCell: () => state.resetCell(idx),
    }))

  console.log(type, outputs, thebeCell?.outputs)

  const ref = useCallback(
    (node) => {
      if (renderUsingThebe && thebeCell && node) {
        const verb = thebeCell.isAttachedToDOM ? 'reattaching' : 'attaching'
        console.debug(`${verb} cell ${thebeCell.id} to DOM at:`, {
          el: node,
          connected: node.isConnected,
        })
        thebeCell.attachToDOM(node)
      }
    },
    [renderUsingThebe, thebeCell],
  )

  let cellBootstrapColumnLayout = metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayout
  // we override or set the former layout if it appears in narrative-step
  if (isNarrativeStep) {
    cellBootstrapColumnLayout = BootstrapNarrativeStepColumnLayout
  }

  const containerClassNames = (metadata.tags ?? []).filter((d) =>
    ArticleCellContainerClassNames.includes(d),
  )

  let statusMessage = ''
  if (executing) {
    statusMessage = 'running...'
  } else if (error) {
    statusMessage = 'error'
  } else if (ready) {
    statusMessage = 'ready'
  }

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
                {ready && thebeCell && (
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
                    <div>{statusMessage}</div>
                    <div style={{ flexGrow: 1 }} />
                    <button onClick={executeCell} disabled={executing}>
                      run
                    </button>
                    <button onClick={clearCell} disabled={executing}>
                      clear
                    </button>
                    <button onClick={resetCell} disabled={executing}>
                      reset
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
                    outputs={outputs}
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

/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellSourceCodeWrapper from './ArticleCellSourceCodeWrapper'
import ArticleCellError from './ArticleCellError'
import {
  BootstrapColumLayout,
  BootstrapNarrativeStepColumnLayout,
  ArticleCellContainerClassNames,
} from '../../constants'
import { useExecutionScope } from './ExecutionScope'
const ArticleCellEditor = React.lazy(() => import('./ArticleCellEditor'))

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
  const [isEditing, setIsEditing] = React.useState(false)

  const executing = useExecutionScope((state) => state.cells[idx]?.executing)
  const errors = useExecutionScope((state) => state.cells[idx]?.errors)
  const outputs = useExecutionScope((state) => state.cells[idx]?.outputs) ?? []
  const thebeCell = useExecutionScope((state) => state.cells[idx]?.thebe)
  const executeCell = useExecutionScope((state) => state.executeCell)
  const clearCell = useExecutionScope((state) => state.clearCell)
  const resetCell = useExecutionScope((state) => state.resetCell)

  const toggleEditCell = () => {
    setIsEditing(!isEditing)
  }

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
  } else if (errors) {
    statusMessage = 'error'
  } else if (ready) {
    statusMessage = 'ready'
  }

  console.debug('[ArticleCell]', idx, 'is rendering')

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
                      color: errors ? 'white' : 'inherit',
                      backgroundColor: errors ? 'red' : 'lightgreen',
                      paddingLeft: 4,
                      paddingRight: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {thebeCell?.executionCount > 0 && (
                      <div title="execution count">[{thebeCell?.executionCount}]:</div>
                    )}
                    <div>{statusMessage}</div>
                    <div style={{ flexGrow: 1 }} />
                    <button onClick={() => executeCell(idx)} disabled={executing}>
                      run
                    </button>
                    <button onClick={() => clearCell(idx)} disabled={executing}>
                      clear
                    </button>
                    <button onClick={() => resetCell(idx)} disabled={executing}>
                      reset
                    </button>
                    <button onClick={toggleEditCell} disabled={executing}>
                      {isEditing ? 'stop editing' : 'edit'}
                    </button>
                  </div>
                )}
                {isEditing ? (
                  <React.Suspense fallback={<div>loading...</div>}>
                    <ArticleCellEditor cellIdx={idx} />
                  </React.Suspense>
                ) : (
                  <ArticleCellSourceCodeWrapper cellIdx={idx} />
                )}
                {errors && <ArticleCellError errors={errors} />}
                <div ref={ref}>
                  {!errors && (
                    <ArticleCellOutputs
                      isMagic={false}
                      isolationMode={false}
                      isJavascriptTrusted={isJavascriptTrusted}
                      cellIdx={idx}
                      outputs={outputs}
                    />
                  )}
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

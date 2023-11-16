/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellSourceCode from '../Article/ArticleCellSourceCode'
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
  source = '',
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
  const [currentCell, setCurrentCell] = React.useState(useExecutionScope.getState().cells[idx])

  const executing = !!currentCell?.executing
  const errors = currentCell?.errors
  const outputs = currentCell?.outputs || []
  const thebeCell = currentCell?.thebe
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  React.useEffect(
    () =>
      useExecutionScope.subscribe((state) => {
        const cell = state.cells[idx]
        if (!cell) return
        if (cell.executing !== !!currentCell?.executing) {
          console.info(
            '[ArticleCell] @useExecutionScope.subscribe',
            idx,
            currentCell?.executing,
            cell.executing,
          )
          setCurrentCell(cell)
        }
      }),
    [],
  )
  const [executeCell, clearCell, resetCell, updateCellSource] = useExecutionScope((state) => [
    state.executeCell,
    state.clearCell,
    state.resetCell,
    state.updateCellSource,
  ])

  const toggleEditCell = () => {
    console.debug('editCell', idx, source)
    setIsEditing(!isEditing)
  }

  const onCellChangeHandler = (value) => {
    console.debug('[ArticleCell] onCellChangeHandler', idx, { value })
    updateCellSource(idx, value)
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
                      {isEditing ? 'preview' : 'edit'}
                    </button>
                  </div>
                )}
                {isEditing ? (
                  <React.Suspense fallback={<div>loading...</div>}>
                    <ArticleCellEditor
                      cellIdx={idx}
                      source={source.join('')}
                      onChange={onCellChangeHandler}
                    />
                  </React.Suspense>
                ) : (
                  <ArticleCellSourceCode visible content={source.join('')} language="python" />
                )}
                {errors && <ArticleCellError errors={errors} />}
                <pre>{JSON.stringify()}</pre>
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

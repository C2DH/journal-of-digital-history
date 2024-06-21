/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Play as PlayIcon } from 'react-feather';

import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellFigure from '../Article/ArticleCellFigure';
import ArticleCellSourceCodeWrapper from './ArticleCellSourceCodeWrapper'
import ArticleCellError from './ArticleCellError'
import {
  BootstrapColumLayout,
  BootstrapColumLayoutV3,
  BootstrapNarrativeStepColumnLayout,
  ArticleCellContainerClassNames,
  LayerData,
  CellTypeCode,
  CellTypeMarkdown
} from '../../constants'
import { useExecutionScope } from './ExecutionScope'

import shineIcon from '../../assets/icons/shine_white.png';

import '../../styles/components/ArticleV3/ArticleCell.scss';


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
  isHermeneutics,
  figure, // ArticleFigure instance
  headingLevel = 0, // if isHeading, set this to its ArticleHeading.level value
  isJavascriptTrusted = false,
  onNumClick,
  renderUsingThebe,
  ready,
}) => {
  const [isEditing, setIsEditing] = React.useState(true)

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

  let cellBootstrapColumnLayout = metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayoutV3[layer];
  // we override or set the former layout if it appears in narrative-step
  if (isNarrativeStep) {
    cellBootstrapColumnLayout = BootstrapNarrativeStepColumnLayout
  }

  // this layout will be applied to module:"object" and module: "text_object"
  let cellObjectBootstrapColumnLayout =
    metadata.jdh?.object?.bootstrapColumLayout || BootstrapColumLayout;

  const containerClassNames = [layer, ...(metadata.tags ?? []).filter((d) =>
    ArticleCellContainerClassNames.includes(d),
  )];

  let statusMessage = ''
  if (executing) {
    statusMessage = 'running...'
  } else if (errors) {
    statusMessage = 'error'
  } else if (ready) {
    statusMessage = 'ready'
  }

  console.debug('[ArticleCell]', idx, 'is rendering')

  return (
    <div className="ArticleCell">

      {type === CellTypeMarkdown ? (

        <Container className={containerClassNames.join(' ')}>
          <Row>
            <Col {...cellBootstrapColumnLayout} className={isHermeneutics ? 'pe-3 ps-5' : ''}>
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
    
      ) : type === CellTypeCode ? (

        <>
  
            {/* {figure &&
              <ArticleCellFigure
                metadata={metadata}
                outputs={outputs}
                figure={figure}
                isolationMode={false}
                isNarrativeStep={isNarrativeStep}
                figureColumnLayout={cellObjectBootstrapColumnLayout}
                isJavascriptTrusted={isJavascriptTrusted}
                containerClassName={containerClassNames.join(' ')}
              ></ArticleCellFigure>
            } */}

          <Container fluid className={`${LayerData} mb-3`}>
            <Row className="gx-0 p-2">
              <Col>
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
              </Col>
            </Row>

            <Row className="gx-0">
              <Col xs={isEditing ? 7 : 12} className='code'>
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
                        <ArticleCellEditor
                          cellIdx = {idx}
                          options = {{
                            readOnly: ready ? false : 'nocursor'
                          }}
                        />
                      </React.Suspense>
                    ) : (
                      <ArticleCellSourceCodeWrapper cellIdx={idx} />
                    )}
                  </div>
                </div>
              </Col>

              {isEditing && (
                <Col xs={5} className="code-tools">
                  <div className="d-flex gap-2">
                    <Button
                      variant   = "outline-white"
                      size      = "sm"
                      disabled  = {!ready || executing}
                      onClick   = {() => executeCell(idx)}
                    >
                      <PlayIcon size={16} />
                      <span>Run code</span>
                    </Button>

                    {thebeCell?.executionCount > 0 && (
                      <div title="execution count">[{thebeCell?.executionCount}]:</div>
                    )}
                    <div>{statusMessage}</div>
                  </div>

                  {errors && <ArticleCellError errors={errors} />}

                  <Button
                    variant="outline-white"
                    size="sm"
                  >
                    <img src={shineIcon} />
                    <span>Explain code</span>
                  </Button>
                </Col>
              )}
            </Row>
          </Container>
        </>

      ) : (
          
        <div>unknown type: {type}</div>
        
      )}

    </div>
  )
}

export default ArticleCell

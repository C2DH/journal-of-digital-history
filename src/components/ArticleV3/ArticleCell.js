/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Play as PlayIcon } from 'react-feather';

import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellFigure from './ArticleCellFigure';
import ArticleCellError from './ArticleCellError'
import {
  BootstrapColumLayout,
  BootstrapColumLayoutV3,
  BootstrapNarrativeStepColumnLayout,
  ArticleCellContainerClassNames,
  LayerData,
  CellTypeCode,
  CellTypeMarkdown,
  LayerHermeneutics
} from '../../constants'
import { useExecutionScope } from './ExecutionScope'

import shineIcon from '../../assets/icons/shine_white.png';

import '../../styles/components/ArticleV3/ArticleCell.scss';


const ArticleCellEditor = React.lazy(() => import('./ArticleCellEditor'));

const RegexIsMagic = /^%%(javascript|js)/;


const ArticleCell = ({
  type,
  layer,
  num = 1,
  content = '',

  idx,
  hideNum,
  metadata = {},
  isNarrativeStep,
  figure, // ArticleFigure instance
  isFigure = false,
  headingLevel = 0, // if isHeading, set this to its ArticleHeading.level value
  active = false,
  isJavascriptTrusted = false,
  onNumClick,
  renderUsingThebe,
  ready,
}) => {

  const executing = useExecutionScope((state) => state.cells[idx]?.executing)
  const errors = useExecutionScope((state) => state.cells[idx]?.errors)
  const outputs = useExecutionScope((state) => state.cells[idx]?.outputs) ?? []
  const thebeCell = useExecutionScope((state) => state.cells[idx]?.thebe)
  const executeCell = useExecutionScope((state) => state.executeCell)
  const clearCell = useExecutionScope((state) => state.clearCell)
  const resetCell = useExecutionScope((state) => state.resetCell)

  const isMagic = RegexIsMagic.test(content);
  const isolationMode = outputs.some(
    (d) => typeof d.metadata === 'object' && d.metadata['text/html']?.isolated,
  )

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

  const containerClassNames = [...(metadata.tags ?? []).filter((d) =>
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

  console.debug('[ArticleCell]', idx, 'is rendering');

  if (type !== CellTypeMarkdown && type !== CellTypeCode)
    return <div>Unkonwn type: {type}</div>

  return (
    <div className={`ArticleCell ${layer}`}>
      <Container fluid={layer === LayerData} className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout} className={layer === LayerHermeneutics ? 'pe-3 ps-5' : ''}>
            {figure ? (
              <ArticleCellFigure
                metadata            = {metadata}
                outputs             = {outputs}
                figure              = {figure}
                isolationMode       = {isolationMode}
                isMagic             = {isMagic}
                active              = {active}
                isJavascriptTrusted = {isJavascriptTrusted}
                cellType            = {type}
              />

            ) : (

              <>
                {type === CellTypeCode && !errors &&
                  <ArticleCellOutputs
                    isMagic             = {false}
                    isolationMode       = {false}
                    isJavascriptTrusted = {isJavascriptTrusted}
                    cellIdx             = {idx}
                    outputs             = {outputs}
                  />
                }
              </>
                
            )}

            {type === CellTypeMarkdown &&
              <ArticleCellContent
                headingLevel  = {headingLevel}
                onNumClick    = {onNumClick}
                hideNum       = {hideNum}
                layer         = {layer}
                content       = {content}
                idx           = {idx}
                num           = {num}
              />
            }

          </Col>
        </Row>

        {type === CellTypeCode && (!isFigure || !figure?.isCover) &&
          
          <Row>
              <Col xs={isFigure ? 12 : 7} className='code'>
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
                      </div>
                    )}
                    <React.Suspense fallback={<div>loading...</div>}>
                      <ArticleCellEditor
                        cellIdx={idx}
                        toggleVisibility
                        visible={!isFigure}
                        options={{
                          readOnly: ready && !figure ? false : 'nocursor'
                        }}
                      />
                    </React.Suspense>
                  </div>
                </div>
              </Col>

              {!isFigure && (
                <Col xs={5} className="code-tools">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-white"
                      size="sm"
                      disabled={!ready || executing}
                      onClick={() => executeCell(idx)}
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
        }
      </Container>
    </div>
  )
}

export default ArticleCell

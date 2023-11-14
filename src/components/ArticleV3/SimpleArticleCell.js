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
  executing,
  executeCell,
}) => {
  const { ready, session } = useThebeSession()

  const ref = useCallback(
    (node) => {
      console.log('ArticleCell ref callback', node, thebeCell)
      if (thebeCell && node && ready) {
        const verb = thebeCell.isAttachedToDOM ? 'reattaching' : 'attaching'
        console.debug(`${verb} cell ${thebeCell.id} to DOM at:`, {
          el: node,
          connected: node.isConnected,
        })
        thebeCell.attachToDOM(node)
      }
    },
    [ready, session],
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
                      backgroundColor: 'lightgreen',
                      paddingLeft: 4,
                      paddingRight: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <div>thebe ready</div>
                    <div style={{ flexGrow: 1 }} />
                    <button onClick={() => thebeCell.execute()} disabled={executing}>
                      run
                    </button>
                    <button onClick={() => thebeCell.clear()} disabled={executing}>
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

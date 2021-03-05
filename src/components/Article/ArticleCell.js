import React, { lazy } from 'react';
import { Container, Row, Col} from 'react-bootstrap'
import ArticleCellOutput from './ArticleCellOutput'
import ArticleCellContent from './ArticleCellContent'
import ArticleCellSourceCode from './ArticleCellSourceCode'

import {
  ModuleStack, ModuleTextObject, ModuleObject,
  ModuleQuote, BootstrapColumLayout
} from '../../constants'

const ArticleCellVisualisation = lazy(() => import('./ArticleCellVisualisation'))
const ArticleCellTextObject = lazy(() => import('./ArticleCellTextObject'))
const ArticleCellObject = lazy(() => import('./ArticleCellObject'))


const ArticleCell = ({
  type, layer, num=1, content='', idx, outputs=[], hideIdx, hideNum, metadata = {},
  progress, active = false,
  ...props
}) => {
  const cellBootstrapColumnLayout = metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayout;
  // this layout will be applied to module:"object" and module: "text_object"
  const cellObjectBootstrapColumnLayout = metadata.jdh?.object?.bootstrapColumLayout || BootstrapColumLayout;

  const cellModule = metadata.jdh?.module

  if (cellModule === ModuleStack) {
    return <ArticleCellVisualisation metadata={metadata} progress={progress} active={active}/>
  }
  if (cellModule === ModuleTextObject) {
    return (
      <Container>
        <Row>
          <Col {... cellBootstrapColumnLayout}>
            <ArticleCellTextObject metadata={metadata} progress={progress} active={active} />
          </Col>
          <Col {... cellObjectBootstrapColumnLayout}>
            <ArticleCellObject metadata={metadata} progress={progress} active={active} />
          </Col>
        </Row>
      </Container>
    )
  }
  if (cellModule === ModuleObject) {
    return (
      <Container>
        <Row>
          <Col {... cellObjectBootstrapColumnLayout}>
            <ArticleCellObject metadata={metadata} progress={progress} active={active}>
              contents.
            </ArticleCellObject>
          </Col>
        </Row>
      </Container>
    )
  }
  if (cellModule === ModuleQuote) {
    return (
      <Container >
        <Row>
          <Col md={{span: 10, offset: 1}}>
            <div className="ArticleCellQuote">
              <ArticleCellContent layer={layer} content={content} idx={idx} num={num} hideNum={hideNum} />
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  if (type === 'markdown') {
    return (
      <Container>
        <Row>
          <Col {... cellBootstrapColumnLayout}>
            <ArticleCellContent layer={layer} content={content} idx={idx} num={num} hideNum={hideNum}/>
          </Col>
        </Row>
      </Container>
    )
  }
  if (type === 'code') {
    return (
      <Container>
        <Row>
          <Col {... cellBootstrapColumnLayout}>
            <div className="ArticleCellContent" id={`P${idx}`}>
              <div className="ArticleCellContent_num">{num}</div>
              <ArticleCellSourceCode content={content} language="python" />
              {outputs.length
                ? outputs.map((output,i) => <ArticleCellOutput output={output} key={i} />)
                : <div>no output</div>
              }
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
  return (<div>unknown type: {type}</div>)
}

export default ArticleCell

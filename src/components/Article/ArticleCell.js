import React, { lazy } from 'react';
import { Container, Row, Col} from 'react-bootstrap'
import ArticleCellOutput from './ArticleCellOutput'
import ArticleCellContent from './ArticleCellContent'
import {
  ModuleStack, ModuleTextObject,
  ModuleQuote, BootstrapColumLayout
} from '../../constants'

const ArticleCellVisualisation = lazy(() => import('./ArticleCellVisualisation'))
const ArticleCellTextObject = lazy(() => import('./ArticleCellTextObject'))


const ArticleCell = ({
  type, layer, num=1, content='', idx, outputs=[], hideIdx, hideNum, metadata = {},
  progress, active = false,
  ...props
}) => {
  if (type === 'markdown') {
    // according to module
    const cellModule = metadata.jdh?.module
    if (cellModule === ModuleStack) {
      return <ArticleCellVisualisation metadata={metadata} progress={progress} active={active}/>
    }
    if (cellModule === ModuleTextObject) {
      return (
        <ArticleCellTextObject metadata={metadata} progress={progress} active={active}>
          <ArticleCellContent layer={layer} content={content} idx={idx} num={num} hideNum={hideNum}/>
        </ArticleCellTextObject>
      )
    }
    if (cellModule === ModuleQuote) {
      return (
        <Container>
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
    return (
      <Container>
        <Row>
          <Col {... BootstrapColumLayout}>
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
          <Col {... BootstrapColumLayout}>
            <div className="ArticleCellContent" id={`P${idx}`}>
              <div className="ArticleCellContent_num">{num}</div>
              <pre className="bg-dark text-white p-3">{content}</pre>
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

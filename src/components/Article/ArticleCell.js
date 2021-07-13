import React, { lazy } from 'react';
import { Container, Row, Col} from 'react-bootstrap'
import ArticleCellOutput from './ArticleCellOutput'
import ArticleCellContent from './ArticleCellContent'
import ArticleCellSourceCode from './ArticleCellSourceCode'
import ArticleCellFigure from './ArticleCellFigure'
import {
  ModuleStack, ModuleTextObject, ModuleObject,
  ModuleQuote, BootstrapColumLayout
} from '../../constants'

const ArticleCellVisualisation = lazy(() => import('./ArticleCellVisualisation'))
const ArticleCellTextObject = lazy(() => import('./ArticleCellTextObject'))
const ArticleCellObject = lazy(() => import('./ArticleCellObject'))


const ArticleCell = ({
  type, layer, num=1, content='', idx, outputs=[], hideNum, metadata = {},
  progress, active = false,
  figure, // ArticleFigure instance
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
            <ArticleCellObject metadata={metadata} progress={progress} active={active} figure={figure} />
          </Col>
        </Row>
      </Container>
    )
  }
  if (!figure && cellModule === ModuleObject) {
    return (
      <Container>
        <Row>
          <Col {... cellObjectBootstrapColumnLayout}>
            <ArticleCellObject metadata={metadata} progress={progress} active={active} figure={figure} />
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
    if (figure) {
      return (
        <ArticleCellFigure
          metadata={metadata}
          figure={figure}
          figureColumnLayout={cellObjectBootstrapColumnLayout}
        >
          <ArticleCellContent hideNum={!!figure} layer={layer} content={content} idx={idx} num={num} />
        </ArticleCellFigure>
      )
    }
    return (
      <Container>
        <Row>
          <Col {... cellBootstrapColumnLayout}>
            <ArticleCellContent hideNum={hideNum} layer={layer} content={content} idx={idx} num={num} />
          </Col>
        </Row>
      </Container>
    )
  }
  if (type === 'code') {
    if (figure) {
      return (
        <ArticleCellFigure
          metadata={metadata}
          outputs={outputs}
          figure={figure}
          sourceCode={<ArticleCellSourceCode toggleVisibility content={content} language="python"/>}
        ></ArticleCellFigure>
      )
    }
    return (
      <Container>
        <Row>
          <Col {... cellBootstrapColumnLayout}>
            <div className="ArticleCellContent">
              <div className="ArticleCellContent_num"></div>
              <ArticleCellSourceCode visible content={content} language="python" />
              {outputs.length
                ? outputs.map((output,i) => <ArticleCellOutput output={output} key={i} />)
                : <div className="ArticleCellSourceCode_no_output">no output</div>
              }
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
  return (<div>unknown type: {type}</div>)
}

export default React.memo(ArticleCell, (prevProps, nextProps) => {
  if (prevProps.memoid === nextProps.memoid || prevProps.active === nextProps.active) {
    return true // props are equal
  }
  return false // props are not equal -> update the component
})

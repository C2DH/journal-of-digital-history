import React, { lazy } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellOutputs from './ArticleCellOutputs'
import ArticleCellContent from './ArticleCellContent'
import ArticleCellSourceCode from './ArticleCellSourceCode'
import ArticleCellFigure from './ArticleCellFigure'
import {
  ModuleStack,
  ModuleTextObject,
  ModuleObject,
  ModuleQuote,
  BootstrapColumLayout,
  BootstrapQuoteColumLayout,
  BootstrapNarrativeStepColumnLayout,
  BootstrapNarrativeStepFigureColumnLayout,
  RoleQuote,
  ArticleCellContainerClassNames,
} from '../../constants'

const ArticleCellVisualisation = lazy(() => import('./ArticleCellVisualisation'))
const ArticleCellTextObject = lazy(() => import('./ArticleCellTextObject'))
const ArticleCellObject = lazy(() => import('./ArticleCellObject'))
const RegexIsMagic = /^%%(javascript|js)/
const ArticleCell = ({
  type,
  layer,
  num = 1,
  content = '',
  idx,
  outputs = [],
  hideNum,
  metadata = {},
  role,
  progress,
  active = false,
  isNarrativeStep,
  figure, // ArticleFigure instance
  headingLevel = 0, // if isHeading, set this to its ArticleHeading.level value
  isJavascriptTrusted = false,
  onNumClick,
  windowHeight = 0,
}) => {
  const isMagic = RegexIsMagic.test(content)
  const isolationMode = outputs.some(
    (d) => typeof d.metadata === 'object' && d.metadata['text/html']?.isolated,
  )

  if (figure) {
    console.debug(
      '[ArticleCell] \n - figure:',
      figure.ref,
      '\n - isMagic:',
      isMagic,
      '\n - isJavascriptTrusted:',
      isJavascriptTrusted,
      '\n - isolationMode:',
      isolationMode,
      '\n - cellIdx:',
      idx,
    )
  } else {
    // console.debug(
    //   '[ArticleCell] \n - isMagic:',
    //   isMagic,
    //   '\n - isJavascriptTrusted:',
    //   isJavascriptTrusted,
    //   '\n - isolationMode:',
    //   isolationMode,
    //   '\n - cellIdx:',
    //   idx,
    // )
  }
  let cellBootstrapColumnLayout = metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayout
  // we override or set the former layout if it appears in narrative-step
  if (isNarrativeStep) {
    cellBootstrapColumnLayout = BootstrapNarrativeStepColumnLayout
  }
  // this layout will be applied to module:"object" and module: "text_object"
  let cellObjectBootstrapColumnLayout =
    metadata.jdh?.object?.bootstrapColumLayout || BootstrapColumLayout
  if (isNarrativeStep && figure) {
    cellObjectBootstrapColumnLayout = BootstrapNarrativeStepFigureColumnLayout
  }
  const cellModule = metadata.jdh?.module

  const containerClassNames = (metadata.tags ?? []).filter((d) =>
    ArticleCellContainerClassNames.includes(d),
  )

  if (cellModule === ModuleStack) {
    return <ArticleCellVisualisation metadata={metadata} progress={progress} active={active} />
  }
  if (cellModule === ModuleTextObject) {
    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout}>
            <ArticleCellTextObject metadata={metadata} progress={progress} active={active} />
          </Col>
          <Col {...cellObjectBootstrapColumnLayout}>
            <ArticleCellObject
              metadata={metadata}
              progress={progress}
              active={active}
              figure={figure}
            />
          </Col>
        </Row>
      </Container>
    )
  }
  if (!figure && cellModule === ModuleObject) {
    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellObjectBootstrapColumnLayout}>
            <ArticleCellObject
              metadata={metadata}
              progress={progress}
              active={active}
              figure={figure}
            />
          </Col>
        </Row>
      </Container>
    )
  }
  if (cellModule === ModuleQuote || role === RoleQuote) {
    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col className="ArticleCellQuote" {...BootstrapQuoteColumLayout}>
            <ArticleCellContent
              onNumClick={onNumClick}
              layer={layer}
              content={content}
              idx={idx}
              num={num}
              hideNum={hideNum}
            />
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
          isJavascriptTrusted={isJavascriptTrusted}
          isMagic={isMagic}
          isolationMode={isolationMode}
          isNarrativeStep={isNarrativeStep}
          containerClassName={containerClassNames.join(' ')}
          windowHeight={windowHeight}
          active={active}
          cellType={type}
        >
          <ArticleCellContent
            onNumClick={onNumClick}
            layer={layer}
            content={content}
            idx={idx}
            num={num}
          />
        </ArticleCellFigure>
      )
    }
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
    if (figure) {
      return (
        <ArticleCellFigure
          metadata={metadata}
          outputs={outputs}
          figure={figure}
          isMagic={isMagic}
          isolationMode={isolationMode}
          isNarrativeStep={isNarrativeStep}
          figureColumnLayout={cellObjectBootstrapColumnLayout}
          isJavascriptTrusted={isJavascriptTrusted}
          windowHeight={windowHeight}
          active={active}
          sourceCode={
            <ArticleCellSourceCode toggleVisibility content={content} language="python" />
          }
          containerClassName={containerClassNames.join(' ')}
        ></ArticleCellFigure>
      )
    }

    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout}>
            <div className="ArticleCellContent">
              <div className="ArticleCellContent_num"></div>
              <ArticleCellSourceCode visible content={content} language="python" />
              <ArticleCellOutputs
                isMagic={isMagic}
                isolationMode={isolationMode}
                isJavascriptTrusted={isJavascriptTrusted}
                cellIdx={idx}
                outputs={outputs}
              />
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
  return <div>unknown type: {type}</div>
}

export default React.memo(
  ArticleCell,
  (prevProps, nextProps) =>
    prevProps.memoid === nextProps.memoid || prevProps.active === nextProps.active,
)

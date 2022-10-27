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

const ArticleCellVisualisation = lazy(() =>
  import('./ArticleCellVisualisation')
)
const ArticleCellTextObject = lazy(() => import('./ArticleCellTextObject'))
const ArticleCellObject = lazy(() => import('./ArticleCellObject'))

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
}) => {
  let cellBootstrapColumnLayout =
    metadata.jdh?.text?.bootstrapColumLayout || BootstrapColumLayout
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
    ArticleCellContainerClassNames.includes(d)
  )

  if (cellModule === ModuleStack) {
    return (
      <ArticleCellVisualisation
        metadata={metadata}
        progress={progress}
        active={active}
      />
    )
  }
  if (cellModule === ModuleTextObject) {
    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout}>
            <ArticleCellTextObject
              metadata={metadata}
              progress={progress}
              active={active}
            />
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
          <Col className='ArticleCellQuote' {...BootstrapQuoteColumLayout}>
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
          isNarrativeStep={isNarrativeStep}
          containerClassName={containerClassNames.join(' ')}
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
          isNarrativeStep={isNarrativeStep}
          figureColumnLayout={cellObjectBootstrapColumnLayout}
          isJavascriptTrusted={isJavascriptTrusted}
          sourceCode={
            <ArticleCellSourceCode
              toggleVisibility
              content={content}
              language='python'
            />
          }
          containerClassName={containerClassNames.join(' ')}
        ></ArticleCellFigure>
      )
    }

    return (
      <Container className={containerClassNames.join(' ')}>
        <Row>
          <Col {...cellBootstrapColumnLayout}>
            <div className='ArticleCellContent'>
              <div className='ArticleCellContent_num'></div>
              <ArticleCellSourceCode
                visible
                content={content}
                language='python'
              />
              <ArticleCellOutputs
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

export default React.memo(ArticleCell, (prevProps, nextProps) => {
  if (
    prevProps.memoid === nextProps.memoid ||
    prevProps.active === nextProps.active
  ) {
    return true // props are equal
  }
  return false // props are not equal -> update the component
})

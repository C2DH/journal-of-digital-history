import React, { useMemo, lazy } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { markdownParser, getParsedSteps } from '../../logic/ipynb'
import { getNarrativeProgress } from '../../logic/narrative'

const VegaWrapper = lazy(() => import('../Module/VegaWrapper'))
const ImageWrapper = lazy(() => import('../Module/ImageWrapper'))


const ArticleCellTextObject = ({ metadata, children, progress }) => {
  const textMetadata = metadata.jdh?.text ?? {}
  const objectMetadata = useMemo(() => metadata.jdh?.object ?? {}, [metadata.jdh])
  const objectOutputs = useMemo(() => metadata.jdh?.outputs ?? [], [metadata.jdh])
  const textColumnLayout = textMetadata.bootstrapColumLayout ?? {
    md: { offset:2, span: 4, order: 1 }
  }
  const objectColumnLayout = objectMetadata.bootstrapColumLayout ?? {
    md: { offset:0, span: 4, order: 2 }
  }
  const objectContents = useMemo(() => {
    if (Array.isArray(objectMetadata.source)) {
      return markdownParser.render(objectMetadata.source.join('\n'))
    }
    return null
  }, [objectMetadata])
  const objectClassName = Array.isArray(objectMetadata.cssClassName)
    ? objectMetadata.cssClassName
    : []

  let objectWrapperStyle = {
    backgroundColor: objectMetadata.background?.color,
    border: objectMetadata.border,
    width: '100%',
    // h is necessary to calculate bounding box correctly.
    // override with HeightRatio
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
  // flex alignment
  if ([ 'start', 'flex-start', 'end', 'flex-end', 'center', 'space-between', 'space-around'].includes(objectMetadata.justifyContent)) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      justifyContent: objectMetadata.justifyContent,
    }
  }
  if ([
    'start', 'flex-start', 'end', 'flex-end', 'center',
    'baseline', 'first baseline'
  ].includes(objectMetadata.alignItems)) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      alignItems: objectMetadata.alignItems,
    }
  }

  if (!isNaN(objectMetadata.heightRatio)) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      height: window.innerHeight * objectMetadata.heightRatio
    }
  }

  if (objectMetadata.position === 'sticky') {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      position: 'sticky',
      top: objectMetadata.top ?? 'var(--spacer-3)',
    }
    if(isNaN(objectMetadata.heightRatio)) {
      objectWrapperStyle.height = 'auto'
    }
  }

  // narrative
  const steps = getParsedSteps({ steps: objectMetadata.steps || [] })
  const { stepProgress, activeStep } = getNarrativeProgress({ steps, progress })

  // if(!isNaN(objectMetadata.ratio)) {
  //   objectWrapperStyle = {
  //     ...objectWrapperStyle,
  //     paddingTop: `${objectMetadata.ratio * 100}%`,
  //     boxSizing: 'border-box',
  //     position: 'relative'
  //   }
  // }

  return (
    <Container>
      <Row>
        <Col {... textColumnLayout}>
          {children}
        </Col>
        <Col {... objectColumnLayout}>
          <div style={objectWrapperStyle} className={objectClassName.join(' ')}>
          {objectMetadata.type === 'image' && objectOutputs.map((output, i) => (
            <ImageWrapper metadata={objectMetadata} key={i} output={output} />
          ))}
          {['video', 'map'].includes(objectMetadata.type) && (
            <>
              {progress}
              <div dangerouslySetInnerHTML={{__html: objectContents}}></div>
            </>
          )}
          {['vega'].includes(objectMetadata.type) && (
            <VegaWrapper
              metadata={objectMetadata}
              steps={steps}
              activeStep={activeStep}
              stepProgress={stepProgress}
              progress={progress}
            />
          )}
          {['text'].includes(objectMetadata.type) && (
            <div dangerouslySetInnerHTML={{__html: objectContents}}></div>
          )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellTextObject

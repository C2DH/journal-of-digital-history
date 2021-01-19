import React, { useMemo, lazy } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { markdownParser } from '../../logic/ipynb'

const VegaWrapper = lazy(() => import('../Module/VegaWrapper'))


const ArticleCellTextObject = ({ metadata, children, progress }) => {
  const textMetadata = metadata.jdh?.text ?? {}
  const objectMetadata = metadata.jdh?.object ?? {}
  const textColumnLayout = textMetadata.bootstrapColumLayout ?? {
    md: { offset:0, span: 6, order: 1 }
  }
  const objectColumnLayout = objectMetadata.bootstrapColumLayout ?? {
    md: { offset:0, span: 6, order: 2 }
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
    height: '100%',
    width: '100%'
  }

  if (objectMetadata.position === 'sticky') {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      position: 'sticky',
      top: window.innerHeight *.1,
      height: window.innerHeight *.8
    }
  }

  if(!isNaN(objectMetadata.ratio)) {
    objectWrapperStyle = {
      ...objectWrapperStyle,
      paddingTop: `${objectMetadata.ratio * 100}%`,
      boxSizing: 'border-box',
    }
  }

  return (
    <Container>
      <Row>
        <Col {... textColumnLayout}>
          {children}
        </Col>
        <Col {... objectColumnLayout}>
          <div style={objectWrapperStyle} className={objectClassName.join(' ')}>
          {['image', 'video', 'map'].includes(objectMetadata.type) && (
            <>
              {progress}
              <div dangerouslySetInnerHTML={{__html: objectContents}}></div>
            </>
          )}
          {['vega'].includes(objectMetadata.type) && (
            <VegaWrapper metadata={objectMetadata}
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

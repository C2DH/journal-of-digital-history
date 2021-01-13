import React, { useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { markdownParser } from '../../logic/ipynb'


const ArticleCellTextObject = ({ metadata, children, progress }) => {
  const textMetadata = metadata.jdh?.text ?? {}
  const objectMetadata = metadata.jdh?.object ?? {}
  const textColumnLayout = textMetadata.bootstrapColumLayout ?? {
    md: { offset:0, span: 6, order: 1 }
  }
  const objectColumnLayout = objectMetadata.bootstrapColumLayout ?? {
    md: { offset:0, span: 6, order: 2 }
  }
  const objectRatio = isNaN(objectMetadata.ratio)
    ? 1.0
    : objectMetadata.ratio

  const objectContents = useMemo(() => {
    if (Array.isArray(objectMetadata.source)) {
      return markdownParser.render(objectMetadata.source.join('\n'))
    }
    return null
  }, [objectMetadata])
  const objectClassName = Array.isArray(objectMetadata.cssClassName)
    ? objectMetadata.cssClassName
    : []

  return (
    <Container>
      <Row>
        <Col {... textColumnLayout}>
          {children}
        </Col>
        <Col {... objectColumnLayout}>
          {['image', 'video', 'map'].includes(objectMetadata.type) && (
            <div style={{
              position: String(objectMetadata.position),
              top: objectMetadata.offsetTop,
              paddingTop: `${objectRatio * 100}%`,
              boxSizing: 'border-box',
              background: objectMetadata.background?.color,
              border: objectMetadata.border
            }}>
              {progress}
              <div dangerouslySetInnerHTML={{__html: objectContents}}></div>
            </div>
          )}
          {['text'].includes(objectMetadata.type) && (
            <div className={objectClassName.join(' ')} dangerouslySetInnerHTML={{__html: objectContents}}></div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellTextObject

import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'


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

  return (
    <Container>
      <Row>
        <Col {... textColumnLayout}>
          {children}
        </Col>
        <Col {... objectColumnLayout}>
          <div style={{
            position: String(objectMetadata.position),
            top: objectMetadata.offsetTop,
            paddingTop: `${objectRatio * 100}%`,
            boxSizing: 'border-box',
            background: objectMetadata.background?.color,
            border: objectMetadata.border
          }}>{progress} </div>
          (  )
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellTextObject

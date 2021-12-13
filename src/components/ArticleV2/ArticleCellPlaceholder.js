import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../../constants'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellSourceCode from '../Article/ArticleCellSourceCode'

const ArticleCellPlaceholder = ({
  type='code',
  layer,
  num=1,
  content='',
  idx,
  headingLevel=0,
}) => {
  return (
    <Container>
      <Row>
        <Col className="ArticleCellPlaceholder" {... BootstrapColumLayout}>
          {type === 'markdown'
            ? (
              <ArticleCellContent
                headingLevel={headingLevel}
                layer={layer}
                content={content}
                idx={idx}
                num={num}
              />
            )
            : (
              <ArticleCellSourceCode
                visible
                content={content}
                language="python"
              />
            )
          }
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellPlaceholder

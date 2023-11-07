import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { ArticleThebeProvider } from './ArticleThebeProvider'
import {
  BootstrapColumLayout,
  BootstrapMainColumnLayout,
  BootstrapSideColumnLayout,
} from '../../constants'

const Article = ({ mode = 'local', url = '', ipynb = { cells: [], metadata: {} }, ...props }) => {
  return (
    <ArticleThebeProvider>
      <Container>
        <Row>
          <Col {...BootstrapColumLayout}>
            <h3>url</h3>
            <pre>{url}</pre>
            <h3>mode</h3>
            <pre>{mode}</pre>
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapMainColumnLayout}>
            <h3>ipynb as JSON</h3>
            <pre>{JSON.stringify(ipynb, null, 2)}</pre>
          </Col>
          <Col {...BootstrapSideColumnLayout}>
            <h3>Other props</h3>
            <pre>{JSON.stringify(props, null, 2)}</pre>
          </Col>
        </Row>
      </Container>
    </ArticleThebeProvider>
  )
}

export default Article

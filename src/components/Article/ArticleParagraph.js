import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
import { BootstrapColumLayout } from '../../constants'
import ArticleCell from './ArticleCell'

const ArticleParagraph = ({cell, idx}) => (
  <Container>
    <Row>
      <Col {... BootstrapColumLayout}>
        <ArticleCell {...cell} idx={idx}/>
      </Col>
    </Row>
  </Container>
)

export default ArticleParagraph

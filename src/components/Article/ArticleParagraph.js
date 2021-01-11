import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
import { BootstrapColumLayout } from '../../constants'
import ArticleCell from './ArticleCell'


const ArticleParagraph = ({cell, progress, active, idx}) => {
  if (cell.isFullWidth()) {
    return <ArticleCell {...cell} progress={progress} active={active} idx={idx}/>
  }
  return (
    <Container>
      <Row>
        <Col {... BootstrapColumLayout}>
          <ArticleCell {...cell} idx={idx}/>
        </Col>
      </Row>
    </Container>
  )
}


export default ArticleParagraph

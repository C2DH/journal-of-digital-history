import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const IssueArticlesGrid = ({articles = []}) => {
  console.info('IssueArticlesGrid', articles)
  return (
    <Container>
      <Row>
        {articles.map((article, i) => (
          <Col key={i} md={{span:3}}>
            {article.data.title}
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default IssueArticlesGrid

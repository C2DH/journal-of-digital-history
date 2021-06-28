import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
// import { useTranslation } from 'react-i18next'
import ArticleFingerprint from '../Article/ArticleFingerprint'


const IssueArticlesGrid = ({articles = []}) => {
  // console.info('IssueArticlesGrid', articles)

  return (
    <Container>
      <Row>
        {articles.map((article, i) => {
          return (
            <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
              <ArticleFingerprint />
              <h3 dangerouslySetInnerHTML={{__html: article.data.title }} />
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default IssueArticlesGrid

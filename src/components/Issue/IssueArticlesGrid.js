import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
import ArticleFingerprint from '../Article/ArticleFingerprint'
import LangLink from '../LangLink'

const IssueArticlesGrid = ({articles = []}) => {
  // console.info('IssueArticlesGrid', articles)

  return (
    <Container>
      <Row>
        {articles.map((article, i) => (
          <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <ArticleFingerprint />
            <h3 className="d-block">
              <LangLink to={`/article/${article.abstract.pid}`}>{article.abstract.title}</LangLink>
            </h3>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
export default IssueArticlesGrid

import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
// import { useTranslation } from 'react-i18next'

const IssueArticlesGrid = ({articles = []}) => {
  console.info('IssueArticlesGrid', articles)
  return (
    <Container>
      <Row>
        {articles.map((article, i) => (
          <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
              {Array(Math.round(Math.random() * 20)).fill(0).map(d => (
                <circle
                  cx={100}
                  cy={100}
                  // cx={100 + 5*Math.random()}
                  // cy={100 + 5*Math.random()}
                  r={80 * Math.random()}
                  fill="transparent" stroke="#000"
                  stroke-width={5 * Math.random()}
                />
              ))}
            </svg>
            <div dangerouslySetInnerHTML={{__html: article.data.title }} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default IssueArticlesGrid

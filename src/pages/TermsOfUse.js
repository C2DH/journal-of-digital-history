import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getArticleTreeFromIpynb } from '../logic/ipynb'

import pageContents from '../data/mock-api/mock-terms-of-use-ipynb.json'
import ArticleCellContent from '../components/Article/ArticleCellContent'

const {paragraphs} = getArticleTreeFromIpynb(pageContents)

const TermsOfUse = () => {
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:8}}>
          {paragraphs.map((props, i) => (
            <ArticleCellContent hideNum hideIdx {...props} idx="" key={i}/>
          ))}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TermsOfUse

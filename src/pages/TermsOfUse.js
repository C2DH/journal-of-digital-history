import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { useStore } from '../store'
import pageContents from '../data/mock-api/mock-terms-of-use-ipynb.json'
import ArticleCellContent from '../components/Article/ArticleCellContent'

const articleTree = getArticleTreeFromIpynb(pageContents)

const TermsOfUse = ({ results }) => {
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--peachpuff)' });
  })
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:8}}>
          {articleTree.paragraphs.map((props, i) => (
            <ArticleCellContent hideNum hideIdx {...props} idx="" key={i}/>
          ))}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TermsOfUse

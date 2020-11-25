import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { useStore } from '../store'
import pageContents from '../data/mock-api/mock-terms-of-use-ipynb.json'
import ArticleCell from '../components/ArticleText/ArticleCell'

const articleTree = getArticleTreeFromIpynb(pageContents)

const TermsOfUse = ({ results }) => {
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--yellow)' });
  })
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:6}}>
          {articleTree.paragraphs.map((props, i) => (
            <ArticleCell {...props} idx="" key={i}/>
          ))}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TermsOfUse

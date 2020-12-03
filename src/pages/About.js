import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { useStore } from '../store'
import pageContents from '../data/mock-api/mock-about-ipynb.json'
import ArticleCell from '../components/ArticleText/ArticleCell'

const articleTree = getArticleTreeFromIpynb(pageContents)

const About = ({ results }) => {
  useEffect(() => {
    useStore.setState({ backgroundColor: 'var(--snow)' });
  })
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:8}}>
          {articleTree.paragraphs.map((props, i) => (
            <ArticleCell {...props} key={i} idx=""/>
          ))}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default About

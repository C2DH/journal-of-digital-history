import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import pageContents from '../data/mock-api/mock-about-ipynb.json'
import ArticleCellContent from '../components/Article/ArticleCellContent'

const { paragraphs } = getArticleTreeFromIpynb(pageContents)

const About = () => {
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:8}}>
          {paragraphs.map((props, i) => (
            <ArticleCellContent hideIdx hideNum {...props} key={i} idx=""/>
          ))}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default About

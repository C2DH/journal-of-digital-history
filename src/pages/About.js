import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { useStore } from '../store'
import pageContents from '../data/mock-api/mock-about-ipynb.json'
import ArticleCellContent from '../components/Article/ArticleCellContent'

const articleTree = getArticleTreeFromIpynb(pageContents)

const About = ({ results }) => {
  const changeBackgroundColor = useStore(state => state.changeBackgroundColor)
  useEffect(() => {
    changeBackgroundColor('var(--linen)')
  })
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:8}}>
          {articleTree.paragraphs.map((props, i) => (
            <ArticleCellContent hideIdx hideNum {...props} key={i} idx=""/>
          ))}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default About

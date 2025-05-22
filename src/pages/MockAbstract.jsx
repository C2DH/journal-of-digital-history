import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import mockAbstract from '../data/mock-api/mock-abstract.json'
import ArticleAuthor from '../components/Article/ArticleAuthor'
import Author from '../models/Author'

const Abstract = () => {
  const { t } = useTranslation()
  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{ offset: 2, span: 6 }}>
            <h3>{t('pages.abstract')} submitted!</h3>
            <h1 className="mt-5">{mockAbstract.title}</h1>
            <p>{mockAbstract.abstract}</p>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col md={{ offset: 2, span: 6 }}>
            <h3>{t('pages.abstract.authors')}</h3>
          </Col>
          {mockAbstract.authors.map((author, i) => (
            <Col key={i} md={{ offset: 2, span: 3 }}>
              <ArticleAuthor author={new Author(author)} />
            </Col>
          ))}
        </Row>
        <Row className="pt-4">
          <Col md={{ offset: 2, span: 6 }}>
            <h3>{t('pages.abstract.contact')}</h3>
            <ArticleAuthor author={new Author(mockAbstract.contact)} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Abstract

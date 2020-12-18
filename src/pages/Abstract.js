import React from 'react'
import {useParams} from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ArticleAuthor from '../components/Article/ArticleAuthor'
import Author from '../models/Author'
import { useGetAbstractSubmission } from '../logic/api/fetchData'


const Abstract = ({ results }) => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { status, item} = useGetAbstractSubmission(id)

  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:6}}>
            <h3>{item.id}</h3>
            <h1 className="my-5">{item.title}</h1>
            <h2 style={{fontWeight: 'normal'}}>{item.abstract}</h2>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:6}}>
            <h3 className="font-weight-normal font-italic">{t('pages.abstract.authors')}</h3>
          </Col>
          {item.authors.map((author,i) => (
            <Col key={i} md={{offset: 2, span: 4}}>
              <ArticleAuthor author={new Author(author)} />
            </Col>
          ))}
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:6}}>
            <h3 className="font-weight-normal font-italic">
            {t('pages.abstract.contact')}
            </h3>
          </Col>
          <Col md={{offset: 2, span:6}}>
            {(new Author(item.contact)).asText()}
          </Col>
        </Row>
        <pre>{status}</pre>
      </Container>
    </>
  )
}

export default Abstract

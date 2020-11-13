import React from 'react'
import {useParams} from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import mockAbstract from '../data/mock-api/mock-abstract.json'
import ArticleAuthor from '../components/ArticleText/ArticleAuthor'
import Author from '../models/Author'
import { useGetAbstractSubmission } from '../logic/api/fetchData'
import LangLink from '../components/LangLink'


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
            <h3>{t('pages.abstract.authors')}</h3>
          </Col>
          {item.authors.map((author,i) => (
            <Col key={i} md={{offset: 2, span: 3}}>
              {(new Author(author)).asText()}
            </Col>
          ))}
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:6}}>
            <h3>{t('pages.abstract.contact')}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={{offset: 2, span:6}}>
            {(new Author(item.contact)).asText()}
          </Col>
        </Row>
        <LangLink to='abstract/24'> to 24 </LangLink>
        <LangLink to='abstract/20'> to 20 </LangLink>
      </Container>
    </>
  )
}

export default Abstract

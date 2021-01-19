import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const NotFound = ({ path }) => {
  const { t } = useTranslation()
  return (
    <Container className="page">
      <Row>
        <Col md={{offset:2}}>
          <h1 className="my-5">{t('pages.notFound.title')}</h1>
          <p>{t('pages.notFound.subheading')}</p>
          {path}
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound

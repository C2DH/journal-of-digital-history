import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const AppRouteLoading = () => {
  const { t } = useTranslation()
  return (
    <Container className="page mt-5">
      <Row>
        <Col md={{offset:2}}>
          <h1 className="my-5">{t('pages.loading.title')}</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default AppRouteLoading

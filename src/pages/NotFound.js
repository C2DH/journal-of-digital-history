import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { BootstrapColumLayout } from '../constants/globalConstants'

const NotFound = ({ className = 'page', children, ...rest }) => {
  const { t } = useTranslation()
  return (
    <Container className={className} {...rest}>
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{t('pages.notFound.title')}</h1>
          <p>{t('pages.notFound.subheading')}</p>
        </Col>
      </Row>

      {!!children && (
        <Row>
          <Col {...BootstrapColumLayout}>{children}</Col>
        </Row>
      )}
    </Container>
  )
}

export default NotFound

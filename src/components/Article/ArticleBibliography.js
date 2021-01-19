import React from 'react'
import {Container, Col, Row} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ArticleBilbiography = ({ articleTree }) => {
  const { t } = useTranslation()

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 7, offset: 2 }}>
          <h2>{t('bibliography')}</h2>
          <div dangerouslySetInnerHTML={{
            __html: articleTree.formatBibliograhpy()
          }}/>
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleBilbiography

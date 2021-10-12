import React from 'react'
import {Container, Col, Row} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ArticleBilbiography = ({ articleTree }) => {
  const { t } = useTranslation()

  return (
    <Container  className="ArticleBilbiography mt-5">
      <Row>
        <Col md={{ span: 7, offset: 2 }}>
          <div id="bibliography" className="anchor" />
          <h2 >{t('bibliography')}</h2>
          <div dangerouslySetInnerHTML={{
            __html: articleTree
              .formatBibliograhpy()
              .replace(/(https?:\/\/[0-9a-zA-Z-./:]+)([^0-9a-zA-Z-./]+)/g, (m, link, r) => `<a href="${link}" _blank="true">${link}</a>${r}`)
          }}/>
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleBilbiography

import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { BootstrapColumLayout } from '../constants'

const Loading = ({ children, title }) => {
  const { t } = useTranslation()
  return (
    <Container className="Loading page pb-0" style={{
      color:  'var(--gray-600)',
      height: window.innerHeight
    }}>
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">
            <span  dangerouslySetInnerHTML={{
              __html: title || t('pages.loading.title')
            }}/>
          </h1>
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default Loading

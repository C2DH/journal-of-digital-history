import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'

import { BootstrapColumLayout } from '../constants/globalConstants'
import hljs from 'highlight.js' // import hljs library

const ErrorViewer = ({ error = {}, language = 'python', className = 'page', children }) => {
  const { t } = useTranslation()

  const cleanError = JSON.stringify(error, null, 2)

  return (
    <Container className={`ErrorViewer ${className}`}>
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5" data-test="error-title">
            {t('pages.errorViewer.title')}
          </h1>
          {error.code === 'ECONNABORTED' ? (
            <h2>{error.message}</h2>
          ) : (
            <h3>{t('pages.errorViewer.subheading')}</h3>
          )}
          <p className="mb-5"> {parse(t('pages.errorViewer.message'))} </p>
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>{children}</Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>
          <div className="alert alert-warning" role="alert">
            page: <b>{window.location.pathname}</b>
            <br />
            {error.message}
          </div>

          <pre
            className="hljs d-block text-wrap"
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              fontFamily: 'monospace',
            }}
            data-test="error-message"
          >
            {cleanError.split('\n').map((line, index) => (
              <div key={index}>{parse(hljs.highlight(language, line).value)}</div>
            ))}
          </pre>
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorViewer

import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import NotFound from './NotFound'
import { BootstrapColumLayout } from '../constants'
import hljs from 'highlight.js' // import hljs library


const ErrorViewer = ({ error={}, errorCode=404, language="python", className='page', children }) => {
  const { t } = useTranslation()
  if (errorCode === 404) {
    return <NotFound />
  }
  const cleanedError = JSON.stringify(error, null, 2)
  const highlighted = language
      ? hljs.highlight(language, cleanedError)
      : hljs.highlightAuto(cleanedError);
  return (
    <Container className={`ErrorViewer ${className})`}>
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{t('pages.errorViewer.title')}

          </h1>
          {error.code === 'ECONNABORTED'
            ? <h2>{error.message}</h2>
            : <h3>{t('pages.errorViewer.subheading')}</h3>

          }
          <p className="mb-5" dangerouslySetInnerHTML={{
            __html: t('pages.errorViewer.message')
          }}/>

        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>
          {children}
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>

          <div className="alert alert-warning" role="alert">
            page: <b>{window.location.pathname}</b>
            <br />{error.message}
          </div>
          <pre className='hljs d-block' dangerouslySetInnerHTML={{ __html: highlighted.value }}/>
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorViewer

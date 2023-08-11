import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { BootstrapFullColumLayout } from '../constants'
import { markdownParser } from '../logic/markdown'
import { decodeNotebookUrl } from '../logic/notebook'
import { StatusSuccess } from '../constants'
import { useTranslation } from 'react-i18next'

import StaticPageLoader from './StaticPageLoader'
const CheckNotebook = ({
  match: {
    params: { encodedUrl = '' },
  },
}) => {
  const { t } = useTranslation()
  const notebookUrl = encodedUrl.length
    ? decodeNotebookUrl(encodedUrl)
    : process.env.REACT_APP_NOTEBOOK_FINGERPRINT_EXPLAINED_URL

  return (
    <>
      <Container className="CheckNotebook page">
        <Row>
          <Col {...BootstrapFullColumLayout}>
            <h1
              className="mt-5 mb-0"
              dangerouslySetInnerHTML={{
                __html: t('pages.checkNotebook.title'),
              }}
            />
          </Col>
        </Row>
      </Container>
      <StaticPageLoader
        url={process.env.REACT_APP_WIKI_FINGERPRINT_EXPLAINED}
        raw
        fakeData=""
        delay={0}
        Component={({ data = '', status }) => (
          <div style={{ minHeight: '100vh' }}>
            <Container>
              <Row>
                <Col
                  {...BootstrapFullColumLayout}
                  dangerouslySetInnerHTML={{
                    __html: status === StatusSuccess ? markdownParser.render(data) : '',
                  }}
                />
              </Row>
            </Container>
            {status}
            {notebookUrl}
          </div>
        )}
      />
    </>
  )
}

export default CheckNotebook

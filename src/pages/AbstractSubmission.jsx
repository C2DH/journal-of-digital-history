import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Col, Row } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { CfpParam } from '../logic/params'

import AbstractSubmissionForm from '../components/AbstractSubmissionForm/AbstractSubmissionForm'
import ErrorViewer from './ErrorViewer'

import AbstractSubmissionCallForPapers from '../components/AbstractSubmissionCallForPapers'

const AbstractSubmission = () => {
  const { t } = useTranslation()
  const [callForPapers, setCallForPapers] = useQueryParam('cfp', withDefault(CfpParam, ''))
  const [errorAPI, setErrorAPI] = useState(null)
  const errorViewerRef = useRef(null)

  const handleErrorAPI = (error) => {
    setErrorAPI(error)
  }

  useEffect(() => {
    if (errorAPI && errorViewerRef.current) {
      errorViewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [errorAPI])

  if (errorAPI) {
    return (
      <Container className="page mb-5">
        <div ref={errorViewerRef}>
          <ErrorViewer error={errorAPI} />
        </div>
      </Container>
    )
  }

  return (
    <Container className="page mb-5">
      <>
        <Row>
          <Col md={{ span: 6, offset: 2 }}>
            <h1 className="my-5">{t('pages.abstractSubmission.title')}</h1>
          </Col>
        </Row>
        <div style={{ paddingLeft: '12px' }}>
          <AbstractSubmissionCallForPapers
            onChange={(cfp) => setCallForPapers(cfp)}
            cfp={callForPapers}
          />
          <br />
          <em className="text-accent offset-md-2">
            {t('pages.abstractSubmission.requiredFieldExplanation')}
          </em>
        </div>
        <AbstractSubmissionForm callForPapers={callForPapers} onErrorAPI={handleErrorAPI} />
        <br />
      </>
    </Container>
  )
}

export default AbstractSubmission

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Col, Row } from 'react-bootstrap'

import AbstractSubmissionForm from '../components/AbstractSubmissionForm/AbstractSubmissionForm'
import ErrorViewer from './ErrorViewer'

import '../styles/pages/AbstractSubmission.scss'

const AbstractSubmission = () => {
  const { t } = useTranslation()
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
            <h1 className="my-5 abstract-submission-title">
              {t('pages.abstractSubmission.title')}
            </h1>
          </Col>
        </Row>
        <AbstractSubmissionForm onErrorAPI={handleErrorAPI} />
        <br />
      </>
    </Container>
  )
}

export default AbstractSubmission

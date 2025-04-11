import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Col, Row } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { CfpParam } from '../logic/params'
import AbstractSubmissionForm from '../components/AbstractSubmissionForm/AbstractSubmissionForm'

import AbstractSubmissionCallForPapers from '../components/AbstractSubmissionCallForPapers'

const AbstractSubmission = () => {
  const { t } = useTranslation()
  const [callForPapers, setCallForPapers] = useQueryParam('cfp', withDefault(CfpParam, ''))
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
      </>
      <AbstractSubmissionForm callForPapers={callForPapers} />
      <br />
    </Container>
  )
}

export default AbstractSubmission

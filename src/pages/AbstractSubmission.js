import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { useQueryParam, withDefault } from 'use-query-params'
import { CfpParam } from '../logic/params'
import ReCAPTCHA from 'react-google-recaptcha'
import { useStore } from '../store'
import { ReCaptchaSiteKey } from '../constants'
import TitleAndAbstractSection from '../components/Forms/AbstractSubmissionForm/TitleAndAbstractSection'
import DatasetsSection from '../components/Forms/AbstractSubmissionForm/DatasetsSection'
import ContactPointSection from '../components/Forms/AbstractSubmissionForm/ContactPointSection'
import AuthorsSection from '../components/Forms/AbstractSubmissionForm/AuthorsSection'
import SocialMediaSection from '../components/Forms/AbstractSubmissionForm/SocialMediaSection'
import AbstractSubmissionPreview from '../components/AbstractSubmissionPreview'
import AbstractSubmissionModal from '../components/Forms/AbstractSubmissionForm/AbstractSubmissionModal'
import AbstractSubmissionCallForPapers from '../components/AbstractSubmissionCallForPapers'
import AcceptConditionSection from '../components/Forms/AbstractSubmissionForm/AcceptConditionSection'
import useAbstractSubmissionValidation from '../hooks/useAbstractSubmissionValidation'
import { default as AbstractSubmissionModel } from '../models/AbstractSubmission'
import {
  handleChange,
  handleAddContactAsAuthor,
  handleSubmit,
} from '../logic/handlers/abstractSubmissionHandlers'

const AbstractSubmission = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [callForPapers, setCallForPapers] = useQueryParam('cfp', withDefault(CfpParam, ''))
  const [isPreviewMode, setPreviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmModalShow, setConfirmModalShow] = useState(false)
  const temporaryAbstractSubmission = useStore((state) => state.temporaryAbstractSubmission)
  const setTemporaryAbstractSubmission = useStore((state) => state.setTemporaryAbstractSubmission)
  const recaptchaRef = React.useRef()
  const [results, setResults] = useState([
    // Initial results setup
  ])
  const validatorResult = useAbstractSubmissionValidation(temporaryAbstractSubmission)

  useEffect(() => {
    handleChange({
      id: 'callForPapers',
      value: callForPapers,
      isValid: true,
      results,
      setResults,
      setTemporaryAbstractSubmission,
    })
  }, [callForPapers])

  if (isSubmitting) {
    console.warn('already busy submitting the form!')
    return
  }

  return (
    <Container className="page mb-5">
      <Row>
        <Col md={{ span: 6, offset: 2 }}>
          <h1 className="my-5">{t('pages.abstractSubmission.title')}</h1>
        </Col>
      </Row>
      <AbstractSubmissionCallForPapers
        onChange={(cfp) => setCallForPapers(cfp)}
        cfp={callForPapers}
      />
      <br />
      <Form
        noValidate
        onSubmit={(e) =>
          handleSubmit(
            e,
            results,
            validatorResult,
            setTemporaryAbstractSubmission,
            recaptchaRef,
            history,
            setIsSubmitting,
          )
        }
      >
        <Row>
          <Col md={{ span: 6, offset: 2 }}>
            <TitleAndAbstractSection
              temporaryAbstractSubmission={temporaryAbstractSubmission}
              handleChange={(data) =>
                handleChange({
                  ...data,
                  results,
                  setResults,
                  setTemporaryAbstractSubmission,
                  temporaryAbstractSubmission,
                })
              }
              isPreviewMode={isPreviewMode}
            />
            <DatasetsSection
              temporaryAbstractSubmission={temporaryAbstractSubmission}
              handleChange={(data) =>
                handleChange({
                  ...data,
                  results,
                  setResults,
                  setTemporaryAbstractSubmission,
                  temporaryAbstractSubmission,
                })
              }
              isPreviewMode={isPreviewMode}
            />
            <ContactPointSection
              temporaryAbstractSubmission={temporaryAbstractSubmission}
              handleChange={(data) =>
                handleChange({
                  ...data,
                  results,
                  setResults,
                  setTemporaryAbstractSubmission,
                  temporaryAbstractSubmission,
                })
              }
              handleAddContactAsAuthor={(author) =>
                handleAddContactAsAuthor(
                  author,
                  temporaryAbstractSubmission,
                  setTemporaryAbstractSubmission,
                  results,
                  setResults,
                )
              }
              isPreviewMode={isPreviewMode}
            />
            <AuthorsSection
              temporaryAbstractSubmission={temporaryAbstractSubmission}
              handleChange={(data) =>
                handleChange({
                  ...data,
                  results,
                  setResults,
                  setTemporaryAbstractSubmission,
                  temporaryAbstractSubmission,
                })
              }
              isPreviewMode={isPreviewMode}
            />
            <SocialMediaSection
              temporaryAbstractSubmission={temporaryAbstractSubmission}
              handleChange={(data) =>
                handleChange({
                  ...data,
                  results,
                  setResults,
                  setTemporaryAbstractSubmission,
                  temporaryAbstractSubmission,
                })
              }
              isPreviewMode={isPreviewMode}
            />
          </Col>
          <Col md={4} lg={3}>
            <AbstractSubmissionPreview
              validatorResult={validatorResult}
              submission={temporaryAbstractSubmission}
              isPreviewMode={isPreviewMode}
              onChangeMode={setPreviewMode}
              onReset={() => setTemporaryAbstractSubmission({})}
            />
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 2 }} className="">
            <AcceptConditionSection
              handleChange={(e) =>
                handleChange({
                  id: 'acceptConditions',
                  value: e.target.checked,
                  isValid: e.target.checked,
                })
              }
              temporaryAbstractSubmission={temporaryAbstractSubmission}
            />
            <p
              className="my-3"
              dangerouslySetInnerHTML={{
                __html: t('pages.abstractSubmission.recaptchaDisclaimer'),
              }}
            />
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={ReCaptchaSiteKey} />
            <div className='text-center mt-5'>
              <Button
                disabled={
                  AbstractSubmissionModel.isPayloadEmpty(temporaryAbstractSubmission) ||
                  validatorResult?.errors.length > 0
                }
                variant="primary"
                size="lg"
                type="submit"
              >
                {t('actions.submit')}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
      <AbstractSubmissionModal
        show={confirmModalShow}
        onHide={() => setConfirmModalShow(false)}
        onConfirm={() =>
          handleSubmit(
            results,
            validatorResult,
            setTemporaryAbstractSubmission,
            recaptchaRef,
            history,
            setIsSubmitting,
          )
        }
      />
    </Container>
  )
}

export default AbstractSubmission

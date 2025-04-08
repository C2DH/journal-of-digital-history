import React, { useEffect, useState, useRef } from 'react'
import parse from 'html-react-parser'
// import ReCAPTCHA from 'react-google-recaptcha'
import Ajv from 'ajv'
import ajvformat from 'ajv-formats'
import { useTranslation } from 'react-i18next'

import { getErrorByField, getErrorBySubfield } from './errors'
import { FormData } from '../../interfaces/abstractSubmission'
import { submissionFormSchema } from '../../schemas/abstractSubmission'
import DynamicForm from './DynamicForm'
import SubmissionStatusCard from './SubmissionStatus'
import StaticForm from './StaticForm'
// import { reCaptchaSiteKey } from '../../constants'
import {
  datasetFields,
  datasetEmpty,
  contributorFields,
  contributorEmpty,
  initialAbstract,
  preferredLanguageOptions,
} from '../../constants/abstractSubmission'
import checkGithubUsername from './checkGithubUsername'
import { debounce } from '../../logic/debounce'
import { getLocalizedPath } from '../../logic/language'

function AbstractSubmissionForm({ callForPapers }: { callForPapers: string }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FormData>(initialAbstract(callForPapers))
  const [confirmEmail, setConfirmEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [githubError, setGithubError] = useState('')
  const [autoFillContributor, setAutoFillContributor] = useState(true)
  // const recaptchaRef = useRef<ReCAPTCHA>(null)

  //Reset UI when form is reset
  const [reset, setReset] = useState(false)

  //Initialization of the JSON validation
  const ajv = new Ajv({ allErrors: true })
  ajvformat(ajv)
  const validate = ajv.compile(submissionFormSchema)
  validate(formData)

  //Update callForPapers in formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, callForPapers }))
  }, [callForPapers])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = validate(formData)

    // TODO: Uncomment reCAPTCHA when form is ready

    // const recaptchaToken = await recaptchaRef.current?.executeAsync();
    // if (!recaptchaToken) {
    //   console.error('ReCAPTCHA failed to generate a token.');
    //   return;
    // }
    // console.log('ReCAPTCHA token:', recaptchaToken);

    if (githubError) {
      console.log('Form cannot be submitted due to GitHub API validation error:', githubError)
      return
    }

    if (formData.contact.email !== confirmEmail) {
      setEmailError(t('pages.abstractSubmission.emailMismatchError'))
      return
    }

    if (!isValid) {
      console.log('Errors', validate.errors)
    } else {
      console.log('Form submitted successfully:', formData)
    }
  }

  const handleConfirmEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmEmail(event.target.value)

    if (event.target.value !== formData.contact.email) {
      setEmailError(t('pages.abstractSubmission.emailMismatchError'))
    } else {
      setEmailError('')
    }
  }

  const handleGithubValidation = async (githubId: string) => {
    if (!githubId) {
      setGithubError('')
      return
    }

    try {
      const isValid = await checkGithubUsername(githubId)
      if (!isValid) {
        setGithubError(t('pages.abstractSubmission.invalidGithubId'))
      } else {
        setGithubError('')
      }
    } catch (error) {
      console.error('Error validating GitHub username:', error)
      setGithubError(t('pages.abstractSubmission.githubApiError'))
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined
    const debouncedGithubValidation = debounce(handleGithubValidation, 1000)

    setFormData((prev: FormData) => {
      const updatedFormData = {
        ...prev,
        dateLastModified: new Date(Date.now()).toISOString(),
      }

      if (id in prev.contact) {
        updatedFormData.contact = {
          ...prev.contact,
          [id]: type === 'checkbox' ? checked : value,
        }

        if (id === 'githubId') {
          console.log('TEST')
          debouncedGithubValidation(value)
        }
      } else {
        updatedFormData[id] = type === 'checkbox' ? checked : value
      }

      if (autoFillContributor && id in prev.contact) {
        const contactAsContributor = {
          firstName: updatedFormData.contact.firstName,
          lastName: updatedFormData.contact.lastName,
          affiliation: updatedFormData.contact.affiliation,
          email: updatedFormData.contact.email,
          orcidUrl: updatedFormData.contact.orcidUrl,
        }
        updatedFormData.contributors = [contactAsContributor, ...prev.contributors.slice(1)]
      }

      return updatedFormData
    })
  }

  const handleOnChangeComponent = (type: string, index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedItems = [...prev[type]]
      updatedItems[index] = { ...updatedItems[index], [field]: value }
      return { ...prev, [type]: updatedItems }
    })
  }

  const handleAddComponent = (type: string, defaultItem: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], defaultItem],
    }))
  }

  const handleRemoveComponent = (type: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i: number) => i !== index),
    }))
  }

  const handleMoveComponent = (type: string, fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const updatedItems = [...prev[type]]
      const [movedItem] = updatedItems.splice(fromIndex, 1)
      updatedItems.splice(toIndex, 0, movedItem)
      return { ...prev, [type]: updatedItems }
    })
  }

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setFormData(initialAbstract(callForPapers))
    setConfirmEmail('')
    setReset(true)
  }

  const handleAutoFillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setAutoFillContributor(isChecked)

    setFormData((prev) => {
      if (isChecked) {
        // Add contact details as the first contributor
        const contactAsContributor = {
          firstName: prev.contact.firstName,
          lastName: prev.contact.lastName,
          affiliation: prev.contact.affiliation,
          email: prev.contact.email,
          orcidUrl: prev.contact.orcidUrl,
          githubId: prev.contact.githubId,
        }
        return {
          ...prev,
          contributors: [contactAsContributor, ...prev.contributors],
        }
      } else {
        // Remove the first contributor
        return {
          ...prev,
          contributors: prev.contributors.slice(1),
        }
      }
    })
  }

  console.log('validate.errors', validate.errors)

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6 offset-md-2 submission-form">
          <form onSubmit={handleSubmit} className="form">
            <div className="title-abstract">
              <h3 className="progressiveHeading">
                {t('pages.abstractSubmission.TitleAndAbstractSectionTitle')}
              </h3>
              <p>{t('pages.abstractSubmission.articleAbstractHelpText')}</p>
              <StaticForm
                id="title"
                label={t('pages.abstractSubmission.articleTitle')}
                value={formData.title}
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'title')}
                reset={reset}
              />
              <StaticForm
                id="abstract"
                label={t('pages.abstractSubmission.articleAbstract')}
                value={formData.abstract}
                type="textarea"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'abstract')}
                reset={reset}
              />
            </div>
            <hr />
            <div className="tools-code-data">
              <DynamicForm
                id="datasets"
                title={t('pages.abstractSubmission.DatasetSectionTitle')}
                buttonLabel="addDataset"
                items={formData.datasets}
                onChange={(index: number, field: string, value: string) =>
                  handleOnChangeComponent('datasets', index, field, value)
                }
                onAdd={() => handleAddComponent('datasets', datasetEmpty)}
                onRemove={(index: number) => handleRemoveComponent('datasets', index)}
                moveItem={(fromIndex: number, toIndex: number) =>
                  handleMoveComponent('datasets', fromIndex, toIndex)
                }
                errors={validate.errors || []}
                fieldConfig={datasetFields}
              />
            </div>
            <div className="contact">
              <h3 className="progressiveHeading">
                {t('pages.abstractSubmission.ContactPointSectionTitle')}
              </h3>
              <StaticForm
                id="firstName"
                label={t('pages.abstractSubmission.authorFirstName')}
                value={formData.contact.firstName}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'firstName')}
                reset={reset}
              />
              <StaticForm
                id="lastName"
                label={t('pages.abstractSubmission.authorLastName')}
                value={formData.contact.lastName}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'lastName')}
                reset={reset}
              />
              <StaticForm
                id="affiliation"
                label={t('pages.abstractSubmission.authorAffiliation')}
                value={formData.contact.affiliation}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'affiliation')}
                reset={reset}
              />
              <StaticForm
                id="email"
                label={t('pages.abstractSubmission.authorEmail')}
                value={formData.contact.email}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'email')}
                reset={reset}
              />
              <StaticForm
                id="confirmEmail"
                label={t('pages.abstractSubmission.authorEmailCheck')}
                value={confirmEmail}
                onChange={handleConfirmEmailChange}
                error={emailError}
                reset={reset}
              />
              <StaticForm
                id="orcidUrl"
                label={t('pages.abstractSubmission.authorOrcid')}
                value={formData.contact.orcidUrl}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'orcidUrl')}
                reset={reset}
              />
              <p className="text-muted form-text">
                {parse(t('pages.abstractSubmission.authorOrcidHelpText'))}
              </p>
              <div className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  id="autoFillContributor"
                  checked={autoFillContributor}
                  onChange={handleAutoFillChange}
                  className="form-check-input"
                />
                <label htmlFor="autoFillContributor" className="form-check-label ms-2">
                  {t('pages.abstractSubmission.defaultContributor')}
                </label>
              </div>
              <hr />
            </div>
            <div className="contributors">
              <DynamicForm
                id="contributors"
                title={t('pages.abstractSubmission.ContributorsSectionTitle')}
                buttonLabel="addContributor"
                items={formData.contributors}
                onChange={(index: number, field: string, value: string) =>
                  handleOnChangeComponent('contributors', index, field, value)
                }
                onAdd={() => handleAddComponent('contributors', contributorEmpty)}
                onRemove={(index: number) => handleRemoveComponent('contributors', index)}
                moveItem={(fromIndex: number, toIndex: number) =>
                  handleMoveComponent('contributors', fromIndex, toIndex)
                }
                errors={validate.errors || []}
                fieldConfig={contributorFields}
              />
            </div>
            <div className="social-media">
              <h3 className="progressiveHeading">
                {t('pages.abstractSubmission.SocialMediaSectionTitle')}
              </h3>
              <p>{t('pages.abstractSubmission.githubIdExplanation')}</p>
              <StaticForm
                id="githubId"
                label={t('pages.abstractSubmission.authorGithubId')}
                value={formData.contact.githubId}
                onChange={handleInputChange}
                error={
                  githubError || getErrorBySubfield(validate.errors || [], 'contact', 'githubId')
                }
                reset={reset}
              />
              <p className="text-muted form-text">
                {parse(t('pages.abstractSubmission.githubIdHelpText'))}
              </p>
              <StaticForm
                id="preferredLanguage"
                label={t('pages.abstractSubmission.preferredLanguage')}
                value={formData.contact.preferredLanguage || 'Python'}
                type="select"
                options={preferredLanguageOptions}
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'preferredLanguage')}
                reset={reset}
              />
              <hr />
              <p>{t('pages.abstractSubmission.socialMediaExplanation')}</p>
              <StaticForm
                id="blueskyId"
                label={t('pages.abstractSubmission.authorBlueskyId')}
                value={formData.contact.blueskyId}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'blueskyId')}
                reset={reset}
              />
              <StaticForm
                id="facebookId"
                label={t('pages.abstractSubmission.authorFacebookId')}
                value={formData.contact.facebookId}
                onChange={handleInputChange}
                error={getErrorBySubfield(validate.errors || [], 'contact', 'facebookId')}
                reset={reset}
              />
              <hr />
            </div>
            <div className="form-check d-flex align-items-center">
              <StaticForm
                id="termsAccepted"
                label={
                  <>
                    {parse(
                      t('pages.abstractSubmission.TermsAcceptance', {
                        termsUrl: getLocalizedPath('/terms'),
                      }),
                    )}
                  </>
                }
                value={formData.termsAccepted}
                type="checkbox"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'termsAccepted')}
                reset={reset}
              />
            </div>
            <br />
            <p>{parse(t('pages.abstractSubmission.recaptchaDisclaimer'))}</p>
            <br />
            {/* <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={reCaptchaSiteKey}
            /> */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-lg">
                {t('actions.submit')}
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-3 col-md-4 submission-status-card">
          <SubmissionStatusCard
            data={formData}
            onReset={handleReset}
            errors={validate.errors || []}
            githubError={githubError}
            mailError={emailError}
          />
        </div>
      </div>
    </div>
  )
}

export default AbstractSubmissionForm

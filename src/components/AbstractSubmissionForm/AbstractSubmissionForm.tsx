import React, { useEffect, useState, useRef, useCallback } from 'react'
import parse from 'html-react-parser'
import ReCAPTCHA from 'react-google-recaptcha'
import Ajv from 'ajv'
import ajvformat from 'ajv-formats'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { getErrorByField } from './errors'
import { FormData, AbstractSubmissionFormProps } from '../../interfaces/abstractSubmission'
import { submissionFormSchema } from '../../schemas/abstractSubmission'
import DynamicForm from './DynamicForm'
import SubmissionStatusCard from './SubmissionStatus'
import StaticForm from './StaticForm'
// import { reCaptchaSiteKey } from '../../constants'
import {
  datasetFields,
  datasetEmpty,
  authorFields,
  authorEmpty,
  contactFields,
  contactEmpty,
  initialAbstract,
  preferredLanguageOptions,
} from '../../constants/abstractSubmissionForm'
import checkGithubUsername from './checkGithubUsername'
import { debounce } from '../../logic/debounce'
import { getLocalizedPath } from '../../logic/language'
import { createAbstractSubmission } from '../../logic/api/postData'

const AbstractSubmissionForm = ({ callForPapers }: AbstractSubmissionFormProps) => {
  const { t } = useTranslation()
  const history = useHistory()

  const [formData, setFormData] = useState<FormData>(initialAbstract(callForPapers))
  const [emailError, setEmailError] = useState('')
  const [githubError, setGithubError] = useState('')

  // const recaptchaRef = useRef<ReCAPTCHA>(null)

  //Initialization of the JSON validation
  const ajv = new Ajv({ allErrors: true })
  ajvformat(ajv)
  const validate = ajv.compile(submissionFormSchema)
  const isValid = validate(formData)

  console.info('[AbstractSubmissionForm - AJV errors] validate.errors', validate.errors)

  //Update callForPapers in formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, callForPapers }))
  }, [callForPapers])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // TODO: Uncomment reCAPTCHA when form is ready

    // const recaptchaToken = await recaptchaRef.current?.executeAsync()
    // if (!recaptchaToken) {
    //   console.error('ReCAPTCHA failed to generate a token.');
    //   return;
    // }
    // console.log('ReCAPTCHA token:', recaptchaToken);

    if (!isValid || !!githubError || !!emailError) {
      console.error('[AbstractSubmissionForm] Form cannot be submitted due to errors.', {
        githubError,
        emailError,
        isValid,
      })
      return
    } else {
      console.info('[AbstractSubmissionForm] Form submitted successfully:', formData)

      localStorage.setItem('formData', JSON.stringify(formData))
      history.push('/en/abstract-submitted', { data: formData })
      // createAbstractSubmission({item: formData, token: recaptchaToken})
      //TODO: maybe try to display thes errors on error page for the submission with ErrorViewer
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
        setGithubError('invalidGithubId')
      } else {
        setGithubError('')
      }
    } catch (error) {
      console.error('[AbstractSubmissionForm] Error validating GitHub username:', error)
      setGithubError('githubApiError')
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined

    setFormData((prev: FormData) => {
      const updatedFormData = {
        ...prev,
        dateLastModified: new Date(Date.now()).toISOString(),
      }

      updatedFormData[id] = type === 'checkbox' ? checked : value

      return updatedFormData
    })
  }

  // Debounce Github API validation of GithubId
  const debouncedGithubValidation = useCallback(debounce(handleGithubValidation, 500), [])

  const handleOnChangeComponent = (
    type: string,
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const updatedItems = [...prev[type]]
      updatedItems[index] = { ...updatedItems[index], [field]: value }

      if (type === 'contact' && field === 'confirmEmail') {
        const email = updatedItems[index].email
        if (email !== value) {
          setEmailError('Emails do not match')
        } else {
          setEmailError('')
        }
      }

      if (type === 'authors' && field === 'githubId') {
        debouncedGithubValidation(value as string)
      }

      if (type === 'authors') {
        const updatedAuthors = updatedItems.map((author, i) => ({
          ...author,
          primaryContact: i === index ? true : false,
        }))

        const selectedAuthor = updatedItems[index]

        if (selectedAuthor.primaryContact) {
          return {
            ...prev,
            contact: [
              {
                ...prev.contact,
                firstname: selectedAuthor.firstname,
                lastname: selectedAuthor.lastname,
                affiliation: selectedAuthor.affiliation,
                email: selectedAuthor.email,
                confirmEmail: '',
              },
            ],
            authors: updatedAuthors,
          }
        }
      }
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

  const handleDownloadJson = () => {
    const json = JSON.stringify(formData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })

    const dateNow = formData.dateLastModified.toString().split('T')[0]
    const fileName = `jdh-abstract-${dateNow}.json`

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6 offset-md-2 submission-form">
          <form onSubmit={handleSubmit} className="form">
            <div className="title-abstract">
              <h3 className="progressiveHeading">
                {t('pages.abstractSubmission.section.titleAndAbstract')}
              </h3>
              <p>{t('pages.abstractSubmission.article.abstractHelpText')}</p>
              <StaticForm
                id="title"
                label={t('pages.abstractSubmission.article.title')}
                required={true}
                value={formData.title}
                type="textarea"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'title')}
                placeholder={t('pages.abstractSubmission.placeholder.title')}
              />
              <StaticForm
                id="abstract"
                label={t('pages.abstractSubmission.article.abstract')}
                required={true}
                value={formData.abstract}
                type="textarea"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'abstract')}
                placeholder={t('pages.abstractSubmission.placeholder.abstract')}
              />
            </div>
            <hr />
            <div className="authors">
              <DynamicForm
                id="authors"
                title={t('pages.abstractSubmission.section.authors')}
                explanation={parse(t('pages.abstractSubmission.author.explanation'))}
                buttonLabel="addAuthor"
                items={formData.authors}
                onChange={(index: number, field: string, value: string) =>
                  handleOnChangeComponent('authors', index, field, value)
                }
                onAdd={() => handleAddComponent('authors', authorEmpty)}
                onRemove={(index: number) => handleRemoveComponent('authors', index)}
                moveItem={(fromIndex: number, toIndex: number) =>
                  handleMoveComponent('authors', fromIndex, toIndex)
                }
                errors={validate.errors || []}
                confirmGithubError={githubError}
                fieldConfig={authorFields}
              />
            </div>
            <hr />
            <div className="contact">
              <DynamicForm
                id="contact"
                title={t('pages.abstractSubmission.section.contact')}
                explanation={parse(t('pages.abstractSubmission.contact.explanation'))}
                buttonLabel="addContact"
                items={formData.contact}
                onChange={(index: number, field: string, value: string | boolean) =>
                  handleOnChangeComponent('contact', index, field, value)
                }
                onAdd={() => handleAddComponent('contact', contactEmpty)}
                onRemove={(index: number) => handleRemoveComponent('contact', index)}
                errors={validate.errors || []}
                confirmEmailError={emailError}
                fieldConfig={contactFields}
                maxItems={1}
              />
              <br />
            </div>
            <hr />
            <div className="repository">
              <h3 className="progressiveHeading">
                {t('pages.abstractSubmission.section.repository')}
              </h3>
              <p>{t('pages.abstractSubmission.github.explanation')}</p>
              <StaticForm
                id="preferredLanguage"
                label={t('pages.abstractSubmission.author.preferredLanguage')}
                required={true}
                value={formData.preferredLanguage || 'Python'}
                type="select"
                options={preferredLanguageOptions}
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'preferredLanguage')}
              />
              <hr />
              <div className="tools-code-data">
                <DynamicForm
                  id="datasets"
                  title={t('pages.abstractSubmission.section.dataset')}
                  explanation={t('pages.abstractSubmission.dataset.explanation')}
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
                <br />
                <br />
              </div>
            </div>
            <div className="form-check d-flex align-items-center">
              <StaticForm
                id="termsAccepted"
                label={
                  <>
                    {parse(
                      t('pages.abstractSubmission.termsAcceptance', {
                        termsUrl: getLocalizedPath('/terms'),
                      }),
                    )}
                  </>
                }
                required={true}
                value={formData.termsAccepted}
                type="checkbox"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'termsAccepted')}
              />
            </div>
            <br />
            <p>{parse(t('pages.abstractSubmission.recaptchaDisclaimer'))}</p>
            {/* <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={reCaptchaSiteKey}
            /> */}
            <div className="text-align-center">
              <button className="btn btn-outline-dark" onClick={handleDownloadJson}>
                {t('actions.downloadAsJSON')}
              </button>
              <button type="submit" className="btn btn-primary " style={{ margin: '2em' }}>
                {t('actions.submit')}
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-3 col-md-4 submission-status-card">
          <SubmissionStatusCard
            data={formData}
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

import React, { useEffect, useState, useRef, useCallback } from 'react'
import parse from 'html-react-parser'
import ReCAPTCHA from 'react-google-recaptcha'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { getErrorByField } from '../../logic/errors'
import {
  FormData,
  AbstractSubmissionFormProps,
  InputChangeHandler,
  UpdateFieldHandler,
  AddItemHandler,
  RemoveItemByTypeHandler,
  MoveItemByTypeHandler,
  ErrorField,
  SubmitHandler,
  GithubIdValidationHandler,
  DynamicFieldUpdateHandler,
} from '../../interfaces/abstractSubmission'
import { submissionFormSchema } from '../../schemas/abstractSubmission'
import DynamicForm from './DynamicForm'
import SubmissionStatusCard from './SubmissionStatus'
import StaticForm from './StaticForm'

// import { reCaptchaSiteKey } from '../../constants/globalConstants'
import {
  datasetFields,
  datasetEmpty,
  authorFields,
  authorEmpty,
  contactFields,
  contactEmpty,
  initialAbstract,
  languagePreferenceOptions,
} from '../../constants/abstractSubmissionForm'
import checkGithubUsername from '../../logic/checkGithubUsername'
import { debounce } from '../../logic/debounce'
import { getLocalizedPath } from '../../logic/language'
import { createAbstractSubmission } from '../../logic/api/postData'

const AbstractSubmissionForm = ({ callForPapers, onErrorAPI }: AbstractSubmissionFormProps) => {
  const { t } = useTranslation()
  //TODO: after Vite migration merged, change useHistory to useNavigate
  const history = useHistory()

  const [formData, setFormData] = useState<FormData>(initialAbstract(callForPapers))
  const [emailError, setEmailError] = useState('')
  const [githubError, setGithubError] = useState('')
  const [missingFields, setMissingFields] = useState<ErrorField>({})
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  //Initialization of the JSON validation
  const ajv = new Ajv({ allErrors: true })
  addFormats(ajv)

  //Add custom validation for githubId authors
  ajv.addKeyword({
    keyword: 'atLeastOneGithubId',
    validate: function validateAtLeastOneGithubId(schema, data) {
      if (!Array.isArray(data)) return false
      return data.some((author) => author.githubId && author.githubId.trim() !== '')
    },
    errors: false,
  })

  const validate = ajv.compile({
    ...submissionFormSchema,
    properties: {
      ...submissionFormSchema.properties,
      authors: {
        ...submissionFormSchema.properties.authors,
        atLeastOneGithubId: true,
      },
    },
  })

  const isValid = validate(formData)

  console.info('[AbstractSubmissionForm - AJV errors] validate.errors', validate.errors)

  //Update callForPapers in formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, callForPapers }))
  }, [callForPapers])

  const handleSubmit: SubmitHandler = async (event) => {
    event.preventDefault()
    setIsSubmitAttempted(true)

    //TODO: uncomment captcha when ready

    // const recaptchaToken = await recaptchaRef.current?.executeAsync()
    // if (!recaptchaToken) {
    //   console.error('ReCAPTCHA failed to generate a token.');
    //   return;
    // }
    // console.log('ReCAPTCHA token:', recaptchaToken);

    const allFields = [
      'title',
      'abstract',
      ...formData.authors.flatMap((_, index) =>
        authorFields.map((field) => `authors/${index}/${field.fieldname}`),
      ),
      ...formData.contact.flatMap((_, index) =>
        contactFields.map((field) => `contact/${index}/${field.fieldname}`),
      ),
      ...formData.datasets.flatMap((_, index) =>
        datasetFields.map((field) => `datasets/${index}/${field.fieldname}`),
      ),
      'languagePreference',
      'termsAccepted',
    ]

    const updatedMissingFields = allFields.reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {} as ErrorField)

    setMissingFields(updatedMissingFields)

    if (!isValid || !!githubError || !!emailError) {
      console.error('[AbstractSubmissionForm] Form cannot be submitted due to errors.', {
        githubError,
        emailError,
        isValid,
      })
      return
    } else {
      localStorage.setItem('formData', JSON.stringify(formData))
      history.push('/en/abstract-submitted', { data: formData })

      // createAbstractSubmission({ item: formData, token: recaptchaToken })
      //   .then((res: { status: number }) => {
      //     if (res?.status === 200 || res?.status === 201) {
      //       console.info('[AbstractSubmissionForm] Form submitted successfully:', formData)
      //       //TODO: after Vite migration merged, change useHistory to useNavigate
      //       history.push('/en/abstract-submitted', { data: formData })
      //     }
      //   })
      //   .catch((err: any) => {
      //     console.info('[AbstractSubmissionForm] ERR',err.response.status, err.message)
      //     onErrorAPI(err)
      //   })
    }
  }

  const handleGithubValidation: GithubIdValidationHandler = async (githubId) => {
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

  const handleInputChange: InputChangeHandler = (event) => {
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

  const handleOnChangeComponent: UpdateFieldHandler = (type, index, field, value) => {
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

  const handleAddComponent: AddItemHandler = (type, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], defaultItem],
    }))
  }

  const handleRemoveComponent: RemoveItemByTypeHandler = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i: number) => i !== index),
    }))
  }

  const handleMoveComponent: MoveItemByTypeHandler = (type, fromIndex, toIndex) => {
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
                placeholder={t('pages.abstractSubmission.placeholder.title')}
                required={true}
                value={formData.title}
                type="textarea"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'title')}
                isMissing={missingFields['title']}
              />
              <StaticForm
                id="abstract"
                label={t('pages.abstractSubmission.article.abstract')}
                placeholder={t('pages.abstractSubmission.placeholder.abstract')}
                required={true}
                value={formData.abstract}
                type="textarea"
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'abstract')}
                isMissing={missingFields['abstract']}
              />
            </div>
            <hr />
            <div className="authors">
              <DynamicForm
                id="authors"
                title={t('pages.abstractSubmission.section.authors')}
                explanation={parse(t('pages.abstractSubmission.author.explanation'))}
                buttonLabel="addAuthor"
                fieldConfig={authorFields}
                items={formData.authors}
                onChange={(index, field, value) =>
                  handleOnChangeComponent('authors', index, field, value)
                }
                onAdd={() => handleAddComponent('authors', authorEmpty)}
                onRemove={(index) => handleRemoveComponent('authors', index)}
                moveItem={(fromIndex, toIndex) =>
                  handleMoveComponent('authors', fromIndex, toIndex)
                }
                errors={validate.errors || []}
                confirmGithubError={githubError}
                missingFields={missingFields}
              />
            </div>
            <hr />
            <div className="contact">
              <DynamicForm
                id="contact"
                title={t('pages.abstractSubmission.section.contact')}
                explanation={parse(t('pages.abstractSubmission.contact.explanation'))}
                buttonLabel="addContact"
                fieldConfig={contactFields}
                items={formData.contact}
                maxItems={1}
                onChange={(index, field, value) =>
                  handleOnChangeComponent('contact', index, field, value)
                }
                onAdd={() => handleAddComponent('contact', contactEmpty)}
                onRemove={(index) => handleRemoveComponent('contact', index)}
                errors={validate.errors || []}
                confirmEmailError={emailError}
                missingFields={missingFields}
              />
              <br />
            </div>
            <hr />
            <div className="repository">
              <h3 className="progressiveHeading">
                {t('pages.abstractSubmission.section.repository')}
              </h3>
              <p>{t('pages.abstractSubmission.repository.explanation')}</p>
              <StaticForm
                id="languagePreference"
                label={t('pages.abstractSubmission.languagePreference')}
                required={true}
                value={formData.languagePreference || 'Python'}
                type="select"
                options={languagePreferenceOptions}
                onChange={handleInputChange}
                error={getErrorByField(validate.errors || [], 'languagePreference')}
                isMissing={missingFields['languagePreference']}
              />
              <hr />
              <div className="tools-code-data">
                <DynamicForm
                  id="datasets"
                  title={t('pages.abstractSubmission.section.datasets')}
                  explanation={t('pages.abstractSubmission.dataset.explanation')}
                  buttonLabel="addDataset"
                  fieldConfig={datasetFields}
                  items={formData.datasets}
                  onChange={(index, field, value) =>
                    handleOnChangeComponent('datasets', index, field, value)
                  }
                  onAdd={() => handleAddComponent('datasets', datasetEmpty)}
                  onRemove={(index) => handleRemoveComponent('datasets', index)}
                  moveItem={(fromIndex, toIndex) =>
                    handleMoveComponent('datasets', fromIndex, toIndex)
                  }
                  errors={validate.errors || []}
                  missingFields={missingFields}
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
                isMissing={missingFields['termsAccepted']}
              />
            </div>
            <br />
            <p>{parse(t('pages.abstractSubmission.recaptchaDisclaimer'))}</p>
            {/* <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={reCaptchaSiteKey}
            /> */}
            <div className="text-center">
              {isSubmitAttempted && (!isValid || !!githubError || !!emailError) && (
                <p className="text-error">{t('pages.abstractSubmission.errors.submitError')}</p>
              )}
              <button className="btn btn-outline-dark" onClick={handleDownloadJson}>
                {t('actions.downloadAsJSON')}
              </button>
              <button type="submit" className="btn btn-primary" style={{ margin: '2em' }}>
                {t('actions.submit')}
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-3 col-md-4">
          <SubmissionStatusCard
            data={formData}
            errors={validate.errors || []}
            githubError={githubError}
            mailError={emailError}
            isSubmitAttempted={isSubmitAttempted}
          />
        </div>
      </div>
    </div>
  )
}

export default AbstractSubmissionForm

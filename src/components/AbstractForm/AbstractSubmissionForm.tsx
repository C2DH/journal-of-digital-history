import React, { useEffect, useState, useRef } from 'react'
// import ReCAPTCHA from 'react-google-recaptcha'
import Ajv from 'ajv'
import ajvformat from 'ajv-formats'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getErrorByField, getErrorBySubfield } from './errors'
import { FormData } from './interface'
import { schema } from './schema'
import DynamicForm from './DynamicForm'
import StaticForm from './StaticForm'
// import { reCaptchaSiteKey } from '../../constants'
import {
  datasetFields,
  datasetEmpty,
  contributorFields,
  contributorEmpty,
  initialAbstract,
} from './constant'

function AbstractSubmissionForm({ callForPapers }: { callForPapers: string }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FormData>(initialAbstract(callForPapers))
  const [confirmEmail, setConfirmEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [autoFillContributor, setAutoFillContributor] = useState(true)
  // const recaptchaRef = useRef<ReCAPTCHA>(null)

  //Propagating reset to UI inside children components
  const [reset, setReset] = useState(false)

  //Initialization of the JSON validation
  const ajv = new Ajv({ allErrors: true })
  ajvformat(ajv)
  const validate = ajv.compile(schema)
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;
  
    setFormData((prev: FormData) => {
      const updatedFormData = {
        ...prev,
        dateLastModified: new Date(Date.now()).toISOString(),
      };
  
      if (id in prev.contact) {
        updatedFormData.contact = {
          ...prev.contact,
          [id]: type === 'checkbox' ? checked : value,
        };
      } else {
        updatedFormData[id] = type === 'checkbox' ? checked : value;
      }
  
      if (autoFillContributor && id in prev.contact) {
        const contactAsContributor = {
          firstName: updatedFormData.contact.firstName,
          lastName: updatedFormData.contact.lastName,
          affiliation: updatedFormData.contact.affiliation,
          email: updatedFormData.contact.email,
          orcidUrl: updatedFormData.contact.orcidUrl,
          githubId: updatedFormData.contact.githubId,
        };
        updatedFormData.contributors = [contactAsContributor, ...prev.contributors.slice(1)];
      }
  
      return updatedFormData;
    });
  };

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

  const handleDownloadAsJSON = () => {
    const jsonData = JSON.stringify(formData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formData.json'
    link.click()
    URL.revokeObjectURL(url)
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
    <form onSubmit={handleSubmit} className="container my-5">
      <div className="title-abstract">
        <h3 className="progressiveHeading">
          {t('pages.abstractSubmission.TitleAndAbstractSectionTitle')}
        </h3>
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
          label={t('pages.abstractSubmission.authorEmail')}
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
        <StaticForm
          id="githubId"
          label={t('pages.abstractSubmission.authorGithubId')}
          value={formData.contact.githubId}
          onChange={handleInputChange}
          error={getErrorBySubfield(validate.errors || [], 'contact', 'githubId')}
          reset={reset}
        />
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
      <div className="form-check d-flex align-items-center">
        <StaticForm
          id="termsAccepted"
          label={t('pages.abstractSubmission.TermsAcceptance')}
          value={formData.termsAccepted}
          type="checkbox"
          onChange={handleInputChange}
          error={getErrorByField(validate.errors || [], 'termsAccepted')}
          reset={reset}
        />
        <Link to="/terms" target="_blank" className="ms-2">
          Terms of Use
        </Link>
      </div>
      <br />
      {/* <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={reCaptchaSiteKey}
      /> */}
      <div className=" align-items-center">
        <button type="submit" className="btn btn-primary">
          {t('actions.submit')}
        </button>
        <button className="btn btn-outline-dark sm" onClick={handleReset}>
          {t('actions.resetForm')}
        </button>
        <button className="btn btn-outline-dark sm" onClick={handleDownloadAsJSON}>
          {t('actions.downloadAsJSON')}
        </button>
      </div>
    </form>
  )
}

export default AbstractSubmissionForm

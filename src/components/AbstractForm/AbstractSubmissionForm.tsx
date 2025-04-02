import React, { useState } from 'react'
import Ajv from 'ajv'
// import { ErrorObject } from 'ajv'
import ajvformat from 'ajv-formats'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getErrorByField, getErrorBySubfield } from './errors'
import { FormData, ValidationErrors } from './interface'
import { schema } from './schema'
import DynamicForm from './DynamicForm'
import StaticForm from './StaticForm'
import {
  datasetFields,
  datasetEmpty,
  contributorFields,
  contributorEmpty,
  abstractFields,
} from './constant'

function AbstractSubmissionForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FormData>(abstractFields)

  //Initialiazation of the JSON validation
  const ajv = new Ajv({ allErrors: true })
  ajvformat(ajv)
  const validate = ajv.compile(schema)
  validate(formData)

  const [errors, setErrors] = useState<ValidationErrors>(
    validate.errors as unknown as ValidationErrors,
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValid = validate(formData)

    if (!isValid) {
      console.log('Errors', validate.errors)
      setErrors(validate.errors as unknown as ValidationErrors)
    } else {
      console.log('Form submitted successfully:', formData)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined

    setFormData((prev) => {
      if (id in prev.contact) {
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [id]: value,
          },
        }
      }

      return {
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      }
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
          error={getErrorByField(validate.errors, 'title')}
        />
        <StaticForm
          id="abstract"
          label={t('pages.abstractSubmission.articleAbstract')}
          value={formData.abstract}
          type="textarea"
          onChange={handleInputChange}
          error={getErrorByField(validate.errors, 'abstract')}
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
          errors={validate.errors}
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
          error={getErrorBySubfield(validate.errors, 'contact', 'firstName')}
        />
        <StaticForm
          id="lastName"
          label={t('pages.abstractSubmission.authorLastName')}
          value={formData.contact.lastName}
          onChange={handleInputChange}
          error={getErrorBySubfield(validate.errors, 'contact', 'lastName')}
        />
        <StaticForm
          id="affiliation"
          label={t('pages.abstractSubmission.authorAffiliation')}
          value={formData.contact.affiliation}
          onChange={handleInputChange}
          error={getErrorBySubfield(validate.errors, 'contact', 'affiliation')}
        />
        <StaticForm
          id="email"
          label={t('pages.abstractSubmission.authorEmail')}
          value={formData.contact.email}
          onChange={handleInputChange}
          error={getErrorBySubfield(validate.errors, 'contact', 'email')}
        />
        <StaticForm
          id="orcidUrl"
          label={t('pages.abstractSubmission.authorOrcid')}
          value={formData.contact.orcidUrl}
          onChange={handleInputChange}
          error={getErrorBySubfield(validate.errors, 'contact', 'orcidUrl')}
        />
        <StaticForm
          id="githubId"
          label={t('pages.abstractSubmission.authorGithubId')}
          value={formData.contact.githubId}
          onChange={handleInputChange}
          error={getErrorBySubfield(validate.errors, 'contact', 'githubId')}
        />
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
          errors={getErrorByField(validate.errors, 'contributors')}
          fieldConfig={contributorFields}
        />
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="termsAccepted">
          {t('pages.abstractSubmission.TermsAcceptance')}
          &nbsp;
          <Link to="/terms" target="_blank">
            Terms of Use
          </Link>
        </label>
        {errors.termsAccepted && (
          <div className="text-danger">{errors.termsAccepted[0].message}</div>
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  )
}

export default AbstractSubmissionForm

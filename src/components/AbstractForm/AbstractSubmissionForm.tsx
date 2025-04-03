import React, { useState } from 'react'
import Ajv from 'ajv'
import ajvformat from 'ajv-formats'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getErrorByField, getErrorBySubfield } from './errors'
import { FormData } from './interface'
import { schema } from './schema'
import DynamicForm from './DynamicForm'
import StaticForm from './StaticForm'
import {
  datasetFields,
  datasetEmpty,
  contributorFields,
  contributorEmpty,
  initialAbstract,
} from './constant'

function AbstractSubmissionForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FormData>(initialAbstract)
  //Propagating reset to UI inside children components
  const [reset, setReset] = useState(false);

  //Initialiazation of the JSON validation
  const ajv = new Ajv({ allErrors: true })
  ajvformat(ajv)
  const validate = ajv.compile(schema)
  validate(formData)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isValid = validate(formData)

    if (!isValid) {
      console.log('Errors', validate.errors)
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

  const handleReset = () => {
    setFormData(initialAbstract);
    setReset(true);
  };

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
        />
        <Link to="/terms" target="_blank" className="ms-2">
          Terms of Use
        </Link>
      </div>
      <br/>
      <div className=" align-items-center">
        <button type="submit" className="btn btn-primary">
        {t('actions.submit')}
        </button>
        <button className="btn btn-outline-dark sm" onClick={handleReset}>
          {t('actions.resetForm')}
        </button>
      </div>
    </form>
  )
}

export default AbstractSubmissionForm

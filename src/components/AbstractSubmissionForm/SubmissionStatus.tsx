import React from 'react'
import { SubmissionStatusCardProps } from '../../interfaces/abstractSubmission'
import { useTranslation } from 'react-i18next'
import { dateFormat, mandatoryTopFields } from '../../constants/abstractSubmission'
import { requiredFieldErrors, addErrorToSection } from './errors'

const SubmissionStatusCard = ({
  data,
  onReset,
  errors,
  githubError,
  mailError,
}: SubmissionStatusCardProps) => {
  const { t } = useTranslation()

  const errorHeaders = requiredFieldErrors(errors)
  if (githubError) {
    addErrorToSection(errorHeaders, 'github')
  }
  if (mailError) {
    addErrorToSection(errorHeaders, 'contact')
  }
  const topLevelErrors = Array.from(errorHeaders)

  const handleDownloadJson = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'submission-data.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="card sticky-top m-0 pe-2 py-2 ps-4 border border-dark rounded"
      style={{ top: '100px' }}
    >
      <div className="card-body">
        <div className="text-accent mb-4">
          <h5>Submission Status</h5>
        </div>
        <div className="mb-3">
          <h6 className="fw-bold">Mandatory Fields to Complete:</h6>
          <ul className="list-unstyled">
            {mandatoryTopFields.map((section) => (
              <li key={section} className="d-flex align-items-center">
                {topLevelErrors.includes(section) ? (
                  <span className="text-danger me-2 material-icons">radio_button_unchecked</span>
                ) : (
                  <span className="text-success me-2 material-icons">check_circle</span>
                )}
                <span>{t(`pages.abstractSubmission.fields${section}`)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <div className="mb-3">
            <span className="badge bg-info">Date Created</span>{' '}
            {new Date(data.dateCreated).toLocaleString('en-GB', dateFormat)}
          </div>
          <div className="mb-3">
            <span className="badge bg-info">Last Modified</span>{' '}
            {new Date(data.dateLastModified).toLocaleString('en-GB', dateFormat)}
          </div>

          <div className="d-flex flex-column">
            <button className="btn btn-outline-dark mb-3" onClick={onReset}>
              {t('actions.resetForm')}
            </button>
            <button className="btn btn-outline-dark" onClick={handleDownloadJson}>
              {t('actions.downloadAsJSON')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionStatusCard

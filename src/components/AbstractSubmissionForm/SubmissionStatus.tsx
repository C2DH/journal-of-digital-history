import React from 'react'
import { SubmissionStatusCardProps } from '../../interfaces/abstractSubmission'
import { useTranslation } from 'react-i18next'
import { dateFormat, mandatoryTopFields } from '../../constants/abstractSubmissionForm'
import { requiredFieldErrors, addErrorToSection } from './errors'

const SubmissionStatusCard = ({
  data,
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

  return (
    <div
      className="card sticky-top m-0 pe-2 py-2 ps-4 border border-dark rounded"
      style={{ top: '100px' }}
    >
      <div className="card-body">
        <div className="text-accent mb-4">
          <h5>{t('pages.abstractSubmission.submissionStatus.header')}</h5>
        </div>
        <div className="mb-3">
          <ul className="list-unstyled">
            {mandatoryTopFields.map((section) => (
              <li key={section} className="d-flex align-items-center">
                {topLevelErrors.includes(section) ? (
                  <span className="text-danger me-2 material-icons">radio_button_unchecked</span>
                ) : (
                  <span className="text-success me-2 material-icons">check_circle</span>
                )}
                <span>{t(`pages.abstractSubmission.submissionStatus.${section}`)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <div className="mb-3">
            <span className="badge bg-info">{t('labels.dateCreated')}</span>{' '}
            {new Date(data.dateCreated).toLocaleString('en-GB', dateFormat)}
          </div>
          <div className="mb-3">
            <span className="badge bg-info">{t('labels.dateLastModified')}</span>{' '}
            {new Date(data.dateLastModified).toLocaleString('en-GB', dateFormat)}
          </div>

          <div className="d-flex flex-column">
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionStatusCard

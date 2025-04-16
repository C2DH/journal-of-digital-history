import React from 'react'

import { SubmissionStatusCardProps } from '../../interfaces/abstractSubmission'
import { useTranslation } from 'react-i18next'
import { dateFormat, mandatoryTopFields } from '../../constants/abstractSubmissionForm'
import { requiredFieldErrors, addErrorToSection } from '../../logic/errors'

import '../../styles/components/AbstractSubmissionForm/SubmissionStatus.scss'

const SubmissionStatusCard = ({
  data,
  errors,
  githubError,
  mailError,
  isSubmitAttempted,
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
    <div className="submission-status-card m-0 pe-6 py-2 ps-4">
      <div className="fw-bold mb-4 submission-status-title">
        <span>{t('pages.abstractSubmission.submissionStatus.header')}</span>
      </div>
      <div className="mb-3">
        <ul className="list-unstyled submission-status-list">
          {mandatoryTopFields.map((section) => {
            const hasError = topLevelErrors.includes(section)
            const submissionError = isSubmitAttempted && hasError

            return (
              <li key={section} className="d-flex align-items-center position-relative">
                <span
                  className={`me-2 material-symbols-outlined ${
                    submissionError ? 'text-error' : 'text-success'
                  }`}
                >
                  {topLevelErrors.includes(section) ? 'radio_button_unchecked' : 'check_circle'}
                </span>
                <div className="round-icon"></div>
                <span className={submissionError ? 'text-error' : ''}>
                  {t(`pages.abstractSubmission.submissionStatus.${section}`)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SubmissionStatusCard

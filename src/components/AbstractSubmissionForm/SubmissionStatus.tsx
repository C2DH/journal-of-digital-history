import { useTranslation } from 'react-i18next'

import { SubmissionStatusCardProps } from '../../interfaces/abstractSubmission'
import { mandatoryTopFields } from '../../constants/abstractSubmissionForm'
import { requiredFieldErrors, addErrorToSection } from '../../logic/errors'

import '../../styles/components/AbstractSubmissionForm/SubmissionStatus.scss'

const SubmissionStatusCard = ({
  errors,
  githubError,
  mailError,
  callForPapersError,
  isSubmitAttempted,
}: SubmissionStatusCardProps) => {
  const { t } = useTranslation()

  const errorHeaders = requiredFieldErrors(errors)
  if(callForPapersError) {
    addErrorToSection(errorHeaders, 'callForPapers')
  }
  if (githubError) {
    addErrorToSection(errorHeaders, 'github')
  }
  if (mailError) {
    addErrorToSection(errorHeaders, 'contact')
  }
  const topLevelErrors = Array.from(errorHeaders)

  return (
    <div className="submission-status-card">
      <div className="submission-status-title">
        <span>{t('pages.abstractSubmission.submissionStatus.header')}</span>
      </div>
      <div className="container">
        <ul className="submission-status-list">
          {mandatoryTopFields.map((section) => {
            const hasError = topLevelErrors.includes(section)
            const submissionError = isSubmitAttempted && hasError

            return (
              <li key={section} >
                <span
                  className={`material-symbols-outlined ${
                    submissionError ? 'text-error' : 'text-success'
                  }`}
                >
                  {submissionError
                    ? 'error'
                    : topLevelErrors.includes(section)
                    ? 'radio_button_unchecked'
                    : 'check_circle'}
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

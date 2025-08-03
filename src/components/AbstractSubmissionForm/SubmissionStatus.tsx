import { useTranslation } from 'react-i18next'

import CheckCircleIcon from '../../assets/icons/CheckCircleIcon'
import ErrorIcon from '../../assets/icons/ErrorIcon'
import RadioButtonUncheckedIcon from '../../assets/icons/RadioButtonUncheckedIcon'
import { mandatoryTopFields } from '../../constants/abstractSubmissionForm'
import { SubmissionStatusProps } from '../../interfaces/abstractSubmission'
import { addErrorToSection, requiredFieldErrors } from '../../logic/errors'

import '../../styles/components/AbstractSubmissionForm/SubmissionStatus.scss'

const SubmissionStatus = ({
  errors,
  githubError,
  callForPapersError,
  isSubmitAttempted,
}: SubmissionStatusProps) => {
  const { t } = useTranslation()

  const errorHeaders = requiredFieldErrors(errors)

  if (callForPapersError) {
    addErrorToSection(errorHeaders, 'callForPapers')
  }
  if (githubError) {
    addErrorToSection(errorHeaders, 'authors')
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
              <li key={section}>
                <div
                  className={`icon-container ${
                    topLevelErrors.includes(section)
                      ? submissionError
                        ? 'error'
                        : 'outlined'
                      : 'filled'
                  }`}
                >
                  <span className="submission-status-icon">
                    {submissionError ? (
                      <ErrorIcon />
                    ) : topLevelErrors.includes(section) ? (
                      <RadioButtonUncheckedIcon />
                    ) : (
                      <CheckCircleIcon />
                    )}
                  </span>
                </div>
                <div className="round-icon"></div>
                <span className={`icon-label ${submissionError ? 'text-error' : ''}`}>
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

export default SubmissionStatus

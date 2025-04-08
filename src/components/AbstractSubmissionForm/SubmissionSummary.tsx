import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { SubmissionSummaryProps } from '../../interfaces/abstractSubmission'

const SubmissionSummary = ({ formData, onReset, handleDownloadJson }: SubmissionSummaryProps) => {
  const { t } = useTranslation()

  useEffect(() => {
    // Scroll to top of page when component is mounted
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 30);
  }, []);

  return (
    <div className="col-md-8 offset-md-2">
      <div className="container my-5 text-center">
        <h1>{t('pages.abstractSubmitted.title')}</h1>
        <br />
        <p>{t('pages.abstractSubmitted.heading')}</p>
        <div className="card mt-5">
          <div className="card-body text-start">
            <pre
              className="bg-light p-3 rounded"
              style={{
                maxWidth: '100%',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {JSON.stringify(formData, null, 3)}
            </pre>
          </div>
        </div>
        <br />
        <p>{parse(t('pages.abstractSubmitted.moreInfo'))}</p>
        <div className="align-items-center">
          <button className="btn btn-primary mt-4" onClick={onReset}>
            {t('actions.submitAnotherAbstract')}
          </button>
          <button
            className="btn btn-outline-dark mt-4"
            onClick={handleDownloadJson}
            style={{ marginLeft: '10px' }}
          >
            {t('actions.downloadAsJSON')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionSummary

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import {  SubmissionSummaryProps } from '../../interfaces/abstractSubmission'
import  InfoCard  from './InfoCard'

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
      <div className="container my-5 text-center  ">
        <h1>{t('pages.abstractSubmitted.title')}</h1>
        <br />
        <p>{t('pages.abstractSubmitted.heading')}</p>
        <div>
        <div className="card mt-5">
          <div className="card-body">
            <h2 className="card-title">{formData.title}</h2>
            <p className="card-text">{formData.abstract}</p>
          </div>
        </div>
        <InfoCard
          title={t('pages.abstractSubmission.section.contact')}
          data={formData.contact}
          fields={[
            { label: t('pages.abstractSubmission.author.firstname'), key: 'firstname' },
            { label: t('pages.abstractSubmission.author.lastname'), key: 'lastname' },
            { label: t('pages.abstractSubmission.author.email'), key: 'email' },
            { label: t('pages.abstractSubmission.author.affiliation'), key: 'affiliation' },
            { label: t('pages.abstractSubmission.author.orcid'), key: 'orcidUrl' },
          ]}
          backgroundColor='bg-light'
          borderColor='border-dark'
        />
        <InfoCard
          title={t('pages.abstractSubmission.section.dataset')}
          data={formData.datasets}
          fields={[
            { label: t('pages.abstractSubmission.dataset.link'), key: 'link' },
            { label: t('pages.abstractSubmission.dataset.description'), key: 'description' },
          ]}
        />
        <InfoCard
          title={t('pages.abstractSubmission.section.contributors')}
          data={formData.contributors}
          fields={[
            { label: t('pages.abstractSubmission.author.firstname'), key: 'firstname' },
            { label: t('pages.abstractSubmission.author.lastname'), key: 'lastname' },
            { label: t('pages.abstractSubmission.author.email'), key: 'email' },
            { label: t('pages.abstractSubmission.author.affiliation'), key: 'affiliation' },
            { label: t('pages.abstractSubmission.author.orcid'), key: 'orcidUrl' },
          ]}
        />
        <InfoCard
          title={t('pages.abstractSubmission.section.socialMedia')}
          data={formData.contact}
          fields={[
            { label: t('pages.abstractSubmission.author.githubId'), key: 'githubId' },
            { label: t('pages.abstractSubmission.author.preferredLanguage'), key: 'preferredLanguage' },
            { label: t('pages.abstractSubmission.author.blueskyId'), key: 'blueskyId' },
            { label: t('pages.abstractSubmission.author.facebookId'), key: 'facebookId' },
          ]}
        />

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

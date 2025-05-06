import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'

import { AbstractSubmittedProps } from '../../interfaces/abstractSubmission'
import SideMenu from './SideMenu'
import { menuItems, menuItemsWithNoDatasets } from '../../constants/abstractSubmissionSummary'

import '../../styles/components/AbstractSubmissionForm/SubmissionSummary.scss'

const SubmissionSummary = ({
  formData,
  navigateBack,
  handleDownloadJson,
}: AbstractSubmittedProps) => {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<string>('informationSubmitted')

  const handleMenuClick = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="container-side-menu" data-test="side-menu">
          <SideMenu
            activeSection={activeSection}
            onMenuClick={handleMenuClick}
            menuItems={formData.datasets?.length === 0 ?  menuItemsWithNoDatasets : menuItems}
          />
        </div>
        <div className="container-summary">
          <section id="informationSubmitted">
            <h1 data-test="header">{t('pages.abstractSubmitted.title')}</h1>
            <p>{t('pages.abstractSubmitted.heading')}</p>
            <p>{parse(t('pages.abstractSubmitted.moreInfo'))}</p>
            <br />
            <div className="button-group" data-test="summary-button-group">
              <button className="btn btn-primary" onClick={navigateBack}>
                {t('actions.submitAnotherAbstract')}
              </button>
              <button className="btn btn-outline-dark" onClick={handleDownloadJson}>
                {t('actions.downloadAsJSON')}
              </button>
            </div>
            <hr />
          </section>
          <section id="titleAndAbstract">
            <h2 data-test="title">{formData.title}</h2>
            <p data-test="abstract">{formData.abstract}</p>
          </section>
          <section id="callForPapers" className="call-for-papers" data-test="call-for-papers">
            <span>
              <b>Call for papers :</b>{' '}
              {formData.callpaper === null
                ? t('pages.abstractSubmission.summary.openSubmission')
                : formData.callpaper}
            </span>
          </section>
          <section id="authors" className="authors" data-test="authors">
            <h2>{t('pages.abstractSubmission.section.authors')}</h2>
            {formData.authors?.map((author: any, index: number) => (
              <div key={index} className="info-section">
                <span className="progressiveHeading author-name">
                  <div key={index} className="info-section">
                    <p>
                      {author.firstname} {author.lastname}
                    </p>
                  </div>
                </span>
                <div className="row">
                  <div className="column">
                    <p>
                      <strong>{t('pages.abstractSubmission.author.affiliation')}:</strong>{' '}
                      {author.affiliation || t('pages.abstractSubmission.author.notProvided')}
                    </p>
                    <p>
                      <strong>{t('pages.abstractSubmission.author.email')}:</strong>{' '}
                      {author.email || t('pages.abstractSubmission.author.notProvided')}
                    </p>
                    <p>
                      <strong>{t('pages.abstractSubmission.author.orcidUrl')}:</strong>{' '}
                      {author.orcid || t('pages.abstractSubmission.author.notProvided')}
                    </p>
                  </div>
                  <div className="column">
                    <p>
                      <strong>{t('pages.abstractSubmission.author.githubId')}:</strong>{' '}
                      {author.github_id || t('pages.abstractSubmission.author.notProvided')}
                    </p>
                    <p>
                      <strong>{t('pages.abstractSubmission.author.facebookId')}:</strong>{' '}
                      {author.facebook_id || t('pages.abstractSubmission.author.notProvided')}
                    </p>
                    <p>
                      <strong>{t('pages.abstractSubmission.author.blueskyId')}:</strong>{' '}
                      {author.bluesky_id || t('pages.abstractSubmission.author.notProvided')}
                    </p>
                    <p>
                      <strong>{t('pages.abstractSubmission.summary.primaryContact')}:</strong>{' '}
                      {author.firstname === formData.contact_firstname
                        ? t('pages.abstractSubmission.summary.primaryContactYes')
                        : t('pages.abstractSubmission.summary.primaryContactNo')}
                    </p>
                    <br/>
                  </div>
                </div>
              </div>
            ))}
          </section>
          {formData.datasets?.length > 0 && (
            <section id="datasets" className="datasets" data-test="datasets">
              <h2>{t('pages.abstractSubmission.section.datasets')}</h2>
              {formData.datasets?.map((dataset: any, index: number) => (
                <div key={index} className="info-section progressiveHeading">
                  <p>
                    <strong>
                      {dataset.url || t('pages.abstractSubmission.dataset.notProvided')}{' '}
                    </strong>
                  </p>
                  <p>{dataset.description || t('pages.abstractSubmission.dataset.notProvided')}</p>
                </div>
              ))}
            </section>
          )}
          <section id="repository" className="repository" data-test="repository">
            <h2>{t('pages.abstractSubmission.section.repository')}</h2>
            <p>
              <strong>{t('pages.abstractSubmission.languagePreference')}:</strong>{' '}
              {formData.language_preference}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SubmissionSummary

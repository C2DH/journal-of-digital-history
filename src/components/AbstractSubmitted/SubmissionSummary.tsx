import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'

import { AbstractSubmittedProps } from '../../interfaces/abstractSubmission'
import SideMenu from './SideMenu'
import { menuItems } from '../../constants/abstractSubmissionSummary'
import { authorFields, datasetFields } from '../../constants/abstractSubmissionForm'

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
            menuItems={menuItems}
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
              {formData.callForPapers === 'openSubmission'
                ? 'Open submission'
                : formData.callForPapers}
            </span>
          </section>
          <section id="authors" className="authors" data-test="authors">
            <h2>{t('pages.abstractSubmission.section.authors')}</h2>
            {formData.authors.map((author: any, index: number) => (
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
                    {authorFields
                      .filter((field) =>
                        ['affiliation', 'email', 'orcidUrl'].includes(field.fieldname),
                      )
                      .map((field) => (
                        <p key={field.fieldname}>
                          <strong>{parse(t(`pages.abstractSubmission.${field.label}`))}:</strong>{' '}
                          {author[field.fieldname] ||
                            t('pages.abstractSubmission.author.notProvided')}
                        </p>
                      ))}
                  </div>
                  <div className="column">
                    {authorFields
                      .filter((field) =>
                        ['githubId', 'facebookId', 'blueskyId', 'primaryContact'].includes(
                          field.fieldname,
                        ),
                      )
                      .map((field) => (
                        <p key={field.fieldname}>
                          <strong>
                            {field.fieldname === 'primaryContact'
                              ? t('pages.abstractSubmission.summary.primaryContact')
                              : parse(t(`pages.abstractSubmission.${field.label}`))}
                            :
                          </strong>{' '}
                          {field.fieldname === 'primaryContact'
                            ? author[field.fieldname]
                              ? t('pages.abstractSubmission.summary.primaryContactYes')
                              : t('pages.abstractSubmission.summary.primaryContactNo')
                            : author[field.fieldname] ||
                              t('pages.abstractSubmission.summary.notProvided')}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
          <section id="datasets" className="datasets" data-test="datasets">
            <h2>{t('pages.abstractSubmission.section.datasets')}</h2>
            {formData.datasets.map((dataset: any, index: number) => (
              <div key={index} className="info-section progressiveHeading">
                {datasetFields.map((field) => (
                  <p key={field.fieldname}>
                    {field.fieldname === 'link' ? (
                      <strong>
                        {dataset[field.fieldname] ||
                          t('pages.abstractSubmission.dataset.notProvided')}
                      </strong>
                    ) : (
                      dataset[field.fieldname] || t('pages.abstractSubmission.dataset.notProvided')
                    )}
                  </p>
                ))}
              </div>
            ))}
          </section>
          <section id="repository" className="repository" data-test="repository">
            <h2>{t('pages.abstractSubmission.section.repository')}</h2>
            <p>
              <strong>{t('pages.abstractSubmission.languagePreference')}:</strong>{' '}
              {formData.languagePreference}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SubmissionSummary

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'

import { AbstractSubmittedProps } from '../../interfaces/abstractSubmission'
import SideMenu from './SideMenu'
import { menuItems } from '../../constants/abstractSubmissionSummary'
import { authorFields, contactFields, datasetFields } from '../../constants/abstractSubmissionForm'

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
    <div className="container my-5 text-start">
      <div className="row">
        <div className="col-md-3">
          <SideMenu
            activeSection={activeSection}
            onMenuClick={handleMenuClick}
            menuItems={menuItems}
          />
        </div>
        <div className="col-md-9">
          <section id="informationSubmitted">
            <h1>{t('pages.abstractSubmitted.title')}</h1>
            <p>{t('pages.abstractSubmitted.heading')}</p>
            <p>{parse(t('pages.abstractSubmitted.moreInfo'))}</p>
            <br />
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-primary" onClick={navigateBack}>
                {t('actions.submitAnotherAbstract')}
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={handleDownloadJson}
                style={{ marginLeft: '10px' }}
              >
                {t('actions.downloadAsJSON')}
              </button>
            </div>
            <div className="my-5"></div>
            <hr />
          </section>
          <section id="titleAndAbstract">
            <h2>{formData.title}</h2>
            <p>{formData.abstract}</p>
          </section>
          <section id="callForPapers" className="mt-4">
            <span className='text-bold'>
              <b>Call for papers :</b>{' '}
              {formData.callForPapers ? formData.callForPapers : 'Open call for papers'}
            </span>
          </section>
          <section id="contact" className="mt-5">
            <h2>{t('pages.abstractSubmission.section.contact')}</h2>
            <div className="info-section">
              <p>
                <strong>{t('pages.abstractSubmission.contact.name')}:</strong>{' '}
                {formData.contact[0]?.firstname ||
                  t('pages.abstractSubmission.contact.notProvided')}{' '}
                {formData.contact[0]?.lastname || t('pages.abstractSubmission.contact.notProvided')}
              </p>
              {contactFields
                .filter((field) => !['firstname', 'lastname'].includes(field.fieldname))
                .map((field) => (
                  <p key={field.fieldname}>
                    <strong>{t(`pages.abstractSubmission.${field.label}`)}:</strong>{' '}
                    {formData.contact[0]?.[field.fieldname] ||
                      t('pages.abstractSubmission.contact.notProvided')}
                  </p>
                ))}
            </div>
          </section>
          <section id="authors" className="mt-5">
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
          <section id="datasets" className="mt-5">
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
          <section id="repository" className="mt-5">
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

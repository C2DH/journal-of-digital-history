import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AbstractSubmittedProps } from '../../interfaces/abstractSubmission'
import SideMenu from './SideMenu'
import { menuItems } from '../../constants/abstractSubmissionSummary'

import '../../styles/components/AbstractSubmissionForm/AbstractSubmissionSummary.scss'

const AbstractSubmissionSummary = ({
  formData,
  onReset,
  handleDownloadJson,
}: AbstractSubmittedProps) => {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<string>('contact')

  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop - 100,
        behavior: 'smooth',
      })
      setHeight(offsetTop)
    }
  }, [activeSection])

  const handleMenuClick = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="container my-5 text-start">
      <div className="row">
        {/* Side Menu */}
        <div className="col-md-3">
          <SideMenu
            activeSection={activeSection}
            onMenuClick={handleMenuClick}
            menuItems={menuItems}
            height={height}
          />
        </div>

        <div className="col-md-9">
          <h1>{t('pages.abstractSubmitted.title')}</h1>
          <p>{t('pages.abstractSubmitted.heading')}</p>
          <br />
          <h2>{formData.title}</h2>
          <p>{formData.abstract}</p>

          {/* Contact Section */}
          <section id="contact" className="mt-5">
            <h2>{t('pages.abstractSubmission.section.contact')}</h2>
            <div className="info-section">
              <p>
                <strong>{t('pages.abstractSubmission.contact.email')}:</strong>{' '}
                {formData.contact[0]?.email}
              </p>
              <p>
                <strong>{t('pages.abstractSubmission.contact.name')}:</strong>{' '}
                {formData.contact[0]?.firstname} {formData.contact[0]?.lastname}
              </p>
            </div>
          </section>

          {/* Authors Section */}
          <section id="authors" className="mt-5">
            <h2>{t('pages.abstractSubmission.section.authors')}</h2>
            {formData.authors.map((author: any, index: number) => (
              <div key={index} className="info-section">
                <p>
                  <strong>{t('pages.abstractSubmission.author.name')}:</strong> {author.firstname}{' '}
                  {author.lastname}
                </p>
                <p>
                  <strong>{t('pages.abstractSubmission.author.email')}:</strong> {author.email}
                </p>
              </div>
            ))}
          </section>

          {/* Dataset Section */}
          <section id="dataset" className="mt-5">
            <h2>{t('pages.abstractSubmission.section.dataset')}</h2>
            <p>{formData.dataset}</p>
          </section>

          {/* Repository Section */}
          <section id="repository" className="mt-5">
            <h2>{t('pages.abstractSubmission.section.repository')}</h2>
            <p>
              <strong>{t('pages.abstractSubmission.languagePreferred')}:</strong> {formData.languagePreferred}
            </p>
          </section>

          {/* Actions */}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary" onClick={onReset}>
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
        </div>
      </div>
    </div>
  )
}

export default AbstractSubmissionSummary

import React from 'react'
import WikiStaticPage from './WikiStaticPage'
import { useTranslation } from 'react-i18next'
import './About.css'

const About = () => {
  const { t } = useTranslation()
  return (
    <WikiStaticPage url={import.meta.env.VITE__WIKI_ABOUT} className="About">
      <h1
        className="my-5"
        dangerouslySetInnerHTML={{
          __html: t('pages.about.title'),
        }}
      />
      <h2 className="my-5">{t('pages.about.subheading')}</h2>
    </WikiStaticPage>
  )
}

export default About

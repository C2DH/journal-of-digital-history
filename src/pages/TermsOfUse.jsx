import React from 'react'
import WikiStaticPage from './WikiStaticPage'
import { useTranslation } from 'react-i18next'


const TermsOfUse = () => {
  const { t } = useTranslation()
  return (
    <WikiStaticPage
      url={import.meta.env.VITE_WIKI_TERMS_OF_USE}
    >
      <h1 className="my-5">{t('pages.termsOfUse.title')}</h1>
    </WikiStaticPage>
  )
}

export default TermsOfUse

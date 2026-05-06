import React from 'react'
import { useTranslation } from 'react-i18next'

import WikiStaticPage from './WikiStaticPage'
import MatomoOptOut from '../components/Cookies/MatomoOptOut'

const termsOfUseShortcodes = [
  {
    name: 'matomo-optout',
    component: <MatomoOptOut />,
  },
]

const TermsOfUse = () => {
  const { t } = useTranslation()
  return (
    <WikiStaticPage
      url={import.meta.env.VITE_WIKI_TERMS_OF_USE}
      shortcodes={termsOfUseShortcodes}
    >
      <h1 className="my-5">{t('pages.termsOfUse.title')}</h1>
    </WikiStaticPage>
  )
}

export default TermsOfUse

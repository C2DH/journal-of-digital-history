import React from 'react'
import WikiStaticPage from './WikiStaticPage'
import { useTranslation } from 'react-i18next'


const ReviewPolicy = () => {
  const { t } = useTranslation()
  return (
    <WikiStaticPage
      url={import.meta.env.VITE_WIKI_REVIEW_POLICY}
    >
      <h1 className="my-5" dangerouslySetInnerHTML={{
        __html: t('pages.reviewPolicy.title')
      }} />
      <h2 className="my-5">{t('pages.reviewPolicy.subheading')}</h2>
    </WikiStaticPage>
  )
}

export default ReviewPolicy
import React from 'react'
import { useTranslation } from 'react-i18next'

const IssueReel = () => {
  const { t } = useTranslation()

  return (
    <div className="IssueReel">
      <h2>{t('HelloWorldTitle')}</h2>
    </div>
  )
}

export default IssueReel

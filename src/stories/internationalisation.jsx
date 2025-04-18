import React from 'react'

import { useTranslation } from 'react-i18next'


export default function Internationalisation() {
  let { t } = useTranslation()

  return (
    <div>
      <h1>{t('Hello')}</h1>
    </div>
  )
}

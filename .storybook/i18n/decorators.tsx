import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

export const decorators = [
  (Story: any, context: any) => {
    const { locale } = context.globals

    useEffect(() => {
      i18n.changeLanguage(locale)
    }, [locale])

    return (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    )
  },
]

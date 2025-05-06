import React, { useEffect } from 'react'
import type { Preview } from '@storybook/react'
import i18n from '../src/i18next.ts'
import { I18nextProvider } from 'react-i18next'

import '../src/styles/index.scss'

//Set up language reads from right to left (eg. Arabic, Japanese)
i18n.on('languageChanged', (locale) => {
  let direction = i18n.dir(locale)
  document.dir = direction
})

//Set up language change
export const withI18next = 
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
  }
export const decorators = [withI18next]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'fr', title: 'Français' },
        ],
        showName: true,
      },
      defaultValue: 'en',
    },
  },
}

export default preview

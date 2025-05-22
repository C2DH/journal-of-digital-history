import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { DateTime } from 'luxon'

import translationEn from './locales/en/translation.json'

const resources = {
  en: {
    translation: translationEn
  }
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({ 
    fallbackLng: 'en',
    resources,
    debug: false,
    interpolation: {
      escapeValue: false
    },
  })

export default i18n

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import translations from './locales/en/translations.json'

import moment from 'moment'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources: translations,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
      format: function (value, format) {
        if (value instanceof Date) {
          if (format === 'fromNow') {
            return moment(value).fromNow()
          }
          return moment(value).format(format)
        }
        return value
      },
    },
  })

export default i18n

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import moment from 'moment'

import translationEn from './locales/en/translation.json'
import translationFr from './locales/fr/translation.json'

const resources = {
  en: {
    translation: translationEn
  },
  fr: {
    translation: translationFr
  }
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({ 
    fallbackLng: 'en',
    resources,
    debug: true,
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

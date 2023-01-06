import i18n from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { getStartLang } from '../src/logic/language'
import translations from '../src/translations'
const { lang } = getStartLang()

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .use(I18NextHttpBackend)
  .init({
    resources: translations,
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, // react already safes from xss
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

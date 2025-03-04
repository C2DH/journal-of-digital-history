import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import translations from '../../src/translations.json'

const ns = ['common']
const supportedLngs = ['en-US', 'fr-FR']

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    // debug: true,
    lng: 'en-US',
    fallbackLng: 'en-US',
    defaultNS: 'common',
    ns,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    supportedLngs,
    resources: translations
  })

export default i18n
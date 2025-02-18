import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { matchPath } from "react-router";
import intersection from 'lodash/intersection'
import find from 'lodash/find'

const LANGUAGES = (import.meta.env.VITE_LANGUAGES ?? 'en-US,fr-FR').split(',');
const LANGUAGES_SHORTS = LANGUAGES.map((l) => l.split('-')[0])
const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE ?? 'en-US';
const DEFAULT_LANGUAGE_SHORT = DEFAULT_LANGUAGE.split('-')[0]
const LANGUAGE_PATH = `/:lang(${LANGUAGES_SHORTS.join('|')})`

const getStartLang = () => {
  const langMatch = matchPath(window.location.pathname, {
    path: LANGUAGE_PATH,
    exact: false,
    strict: false,
  })
  let startLangShort = langMatch?.params?.lang
  if (!startLangShort || !LANGUAGES_SHORTS.includes(startLangShort)) {
    // get default short language from browser
    const browserLangsShort = window.navigator?.languages ?? []
    console.info('browser languages detected:', browserLangsShort)
    const availablesLangsShort = intersection(browserLangsShort, LANGUAGES_SHORTS)
    startLangShort = availablesLangsShort.length > 0
      ? availablesLangsShort[0]
      : DEFAULT_LANGUAGE_SHORT
  }
  return {
    startLangShort,
    lang: find(LANGUAGES, (l) => l.indexOf(startLangShort) === 0)
  }
}

function namespacePath(path, lang) {
  let pathWithLang = `/${lang}`
  if (path[0] === '/') {
    pathWithLang += path
  } else {
    pathWithLang += `/${path}`
  }
  return pathWithLang
}

const useToWithLang = (to) => {
  const { i18n } = useTranslation()
  let { lang } = useParams()
  if (!lang) {
    // NOTE: Workaround when no lang in current path
    // fallback to current i81n language ...
    lang = i18n.language.split('-')[0]
  }

  if (typeof to === 'string') {
    return namespacePath(to, lang)
  } else {
    return {
      ...to,
      pathname: namespacePath(to.pathname, lang),
    }
  }
}

export {
  getStartLang,
  useToWithLang,
  LANGUAGE_PATH,
  LANGUAGES
}

import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { matchPath } from 'react-router'

const LANGUAGES = (import.meta.env.VITE_LANGUAGES ?? 'en-GB,fr-FR').split(',')
const LANGUAGES_SHORTS = LANGUAGES.map((l) => l.split('-')[0])
const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE ?? 'en-GB'
const DEFAULT_LANGUAGE_SHORT = 'en'
const LANGUAGE_PATH = `/:lang(${LANGUAGES_SHORTS.join('|')})`

const EXCLUDED_PATHS = ['/dashboard', '/dashboard/']

/**
 * Determines the starting language for the application based on the current URL path
 * and the user's browser language preferences.
 *
 * @returns {{ short: string, lng: string }} An object containing:
 *   - short: The short language code (e.g., 'en', 'fr').
 *   - lng: The full language string as found in LANGUAGES or the default language.
 */
const getStartLang = () => {
  const langMatch = matchPath(
    {
      path: LANGUAGE_PATH,
      exact: false,
      strict: false,
    },
    window.location.pathname,
  )
  let short = langMatch?.params?.lang

  // Check browser languages
  if (!short || !LANGUAGES_SHORTS.includes(short)) {
    const browserLangs = window.navigator?.languages ?? []
    const found = browserLangs.map((l) => l.split('-')[0]).find((l) => LANGUAGES_SHORTS.includes(l))
    short = found || DEFAULT_LANGUAGE_SHORT
  }

  const lng = LANGUAGES.find((l) => l.startsWith(short)) || DEFAULT_LANGUAGE

  return { short, lng }
}

/**
 * Prepends a language code to a given path, unless the path is in the EXCLUDED_PATHS list.
 *
 * - If the path starts with '/', the language code is inserted after the leading slash.
 * - If the path is in EXCLUDED_PATHS, it is returned unchanged.
 * - Otherwise, the language code is prepended to the path.
 *
 * @param {string} path - The URL path to namespace.
 * @param {string} lang - The language code to prepend.
 * @returns {string} The namespaced path with the language code, or the original path if excluded.
 */
const namespacePath = (path, lang) => {
  if (path.startsWith('/')) {
    return `/${lang}${path}`
  } else if (EXCLUDED_PATHS.includes(path)) {
    return path
  } else {
    return `/${lang}/${path}`
  }
}

/**
 * Returns a localized path or location object with the current language namespace.
 *
 * This hook uses the current language from the URL params or i18n context,
 * and prepends the language namespace to the given path or location object.
 *
 * @param {string|Object} to - The target path as a string, or a location object with a `pathname` property.
 * @returns {string|Object} The namespaced path as a string, or a location object with the namespaced `pathname`.
 */
const useToWithLang = (to) => {
  const { i18n } = useTranslation()
  let { lang } = useParams()
  if (!lang) {
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

/**
 * Constructs a localized URL path by appending the given path to the base path
 * derived from the current window location.
 *
 * Example:
 * If the current window location is '/en/some-path' and the provided path is'/terms',
 * it will return '/en/terms'.
 *
 * @param {string} path - The relative path to append to the base path.
 * @returns {string} The localized URL path.
 */
const getLocalizedPath = (path) => {
  const basePath = window.location.pathname.split('/')[1]
  return `/${basePath}${path}`
}

export { getStartLang, useToWithLang, getLocalizedPath, LANGUAGE_PATH, LANGUAGES }

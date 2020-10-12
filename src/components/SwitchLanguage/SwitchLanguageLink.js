import React, { useMemo } from 'react'
import { Link, useLocation, matchPath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


function makeLangLink(location, lang) {
  const match = matchPath(location.pathname, {
    path: '/:lang/:where*',
    exact: false,
    strict: false
  })
  let url = `/${lang.split('_')[0]}`
  if (match && match.params.where) {
    url += '/' + match.params.where
  }
  return url
}

export default function SwitchLanguageLink({ lang, onClick, ...props }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const to = useMemo(() => makeLangLink(location, lang), [location, lang])

  return (
    <Link
      onClick={(e) => {
        i18n.changeLanguage(lang)
        onClick && onClick(e)
      }}
      to={to}
      {...props}
    />
  )
}

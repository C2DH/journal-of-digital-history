import React from "react"
import { useTranslation } from "react-i18next"
import { useGetJSON } from "../logic/api/fetchData"

/**
 * React component that loads the username from the rest url /api/me.
 * If the request succeeds, the components render the user first_name and username.
 * If the request fails, the component silently fails.
 * @return {React.Component} The component.
 */
const Me = () => {
  const { t } = useTranslation()
  const { data, error } = useGetJSON({
    url: '/api/me', 
  })
  console.debug('[Me]', error, data)
  if (error) return null
  if (!data) return null
  return (
    <div className="Me position-fixed bottom-0">
      <h1>{t('pages.me.title')}</h1>
      <p>
        {t('pages.me.hello')} {data.first_name} ({data.username})
      </p>
    </div>
  )
}

export default Me
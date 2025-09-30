import '../../styles/components/Me.css'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJSON } from '../../logic/api/fetchData'
import { generateColorList } from './helper'

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
    failSilently: true,
  })

  console.debug('[Me]', error, data)
  if (error) return null
  if (!data) return null
  return (
    <div className="Me">
      <div>
        {t('welcomeBack')}
        <a href="/admin" title={data.username}>
          {data.first_name.length ? data.first_name : data.username}
        </a>
        <div className="Me_avatar" style={{ background: generateColorList(data.username) }}></div>
      </div>
    </div>
  )
}

export default Me

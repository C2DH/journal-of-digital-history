import '../../styles/components/Me.css'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJSON } from '../../logic/api/fetchData'
import { generateColorList } from './helper'

import { LogOut, OpenInBrowser, ProfileCircle } from 'iconoir-react'

/**
 * React component that loads the username from the rest url /api/me.
 * If the request succeeds, the components render the user first_name and username.
 * If the request fails, the component silently fails.
 * @return {React.Component} The component.
 */
const Me = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { data, error } = useGetJSON({
    url: '/api/me',
    failSilently: true,
  })

  console.debug('[Me]', error, data)
  if (error) return null
  if (!data) return null

  return (
    <div className="me">
      <div>
        {t('welcomeBack')}
        <button className="me-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          {data.first_name.length ? data.first_name : data.username} {isOpen ? '▲' : '▼'}
        </button>
        {isOpen && (
          <div className="me-dropdown-menu">
            <a href={`/admin/auth/user/${data.id}/change/`} title="User settings">
              <ProfileCircle /> My profile
            </a>
            <a href={`/dashboard/`} title="Switch to dashboard">
              <OpenInBrowser /> Go to dashboard
            </a>
            <a href={`/admin/logout/`} title="Log out">
              <LogOut /> Sign out
            </a>
          </div>
        )}
        <div className="me-avatar" style={{ background: generateColorList(data.username) }}></div>
      </div>
    </div>
  )
}

export default Me

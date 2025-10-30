import './Me.css'

import { GithubCircle, LogOut, OpenInBrowser, ProfileCircle } from 'iconoir-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'

import { DisplayLayerQueryParam, LayerNarrative } from '../../constants/globalConstants'

import { useGetJSON } from '../../logic/api/fetchData'
import { userLogoutRequest } from '../../logic/api/login'
import { generateColorList } from './helper'

/**
 * React component that loads the username from the rest url /api/me.
 * If the request succeeds, the components render the user username.
 * If the request fails, the component silently fails.
 */
const Me = () => {
  const { t } = useTranslation()
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const { data, error } = useGetJSON({
    url: '/api/me',
    failSilently: true,
  })
  const username = data?.username || data?.first_name || 'User'
  const avatarBg = useMemo(() => generateColorList(username), [username])

  //To see if we are in dashboard or in JDH
  const pathname = window.location.pathname
  const path = pathname.split('/').filter(Boolean)[0] || ''

  // To see if narrative or hermeneutics layer is selected for article view
  let layer = ''
  if (path != 'dashboard') {
    const [selectedLayer] = useQueryParams({
      [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
    })
    layer = selectedLayer.layer
  }

  if (error || !data) return null

  const handleLogout = async () => {
    await userLogoutRequest()
  }

  return (
    <div className={`me ${path}`}>
      <div>
        {t('loggedInAs')}
        <button
          className={`me-dropdown-button ${path}`}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          {data.first_name.length ? data.first_name : data.username} {isDropdownOpen ? '▲' : '▼'}
        </button>
        {isDropdownOpen && (
          <div className={`me-dropdown-menu ${path} ${layer}`}>
            <a href={`/admin/auth/user/${data.id}/change/`} title="User settings">
              <ProfileCircle /> {t('login.profile')}
            </a>
            <a href="https://github.com/orgs/C2DH/projects/10" title="Github article workflow">
              <GithubCircle /> {t('login.githubArticleWorkflow')}
            </a>
            <a href={path === 'dashboard' ? `/` : `/dashboard/`} title="Switch to dashboard">
              <OpenInBrowser /> {t(`login.goJDH.${path}`)}
            </a>
            <a
              title="Log out"
              onClick={async () => {
                await handleLogout()
                window.location.href = '/'
              }}
            >
              <LogOut /> {t('login.signOut')}
            </a>
          </div>
        )}
        <div className={`me-avatar ${path}`} style={{ background: avatarBg }}></div>
      </div>
    </div>
  )
}

export default Me

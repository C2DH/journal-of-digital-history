import './Me.css'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJSON } from '../../logic/api/fetchData'
import { userLogoutRequest } from '../../logic/api/login'
import { generateColorList } from './helper'

import { GithubCircle, LogOut, OpenInBrowser, ProfileCircle } from 'iconoir-react'

/**
 * React component that loads the username from the rest url /api/me.
 * If the request succeeds, the components render the user username.
 * If the request fails, the component silently fails.
 */
const Me = () => {
  const { t } = useTranslation()
  const pathname = window.location.pathname
  const cleanPathname = pathname.split('/').filter(Boolean)[0] || ''

  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const { data, error } = useGetJSON({
    url: '/api/me',
    failSilently: true,
  })
  const username = data?.username || data?.first_name || 'User'
  const avatarBg = useMemo(() => generateColorList(username), [username])

  if (error || !data) return null

  const handleLogout = async () => {
    await userLogoutRequest()
  }

  return (
    <div className={`me ${cleanPathname}`}>
      <div>
        {t('loggedInAs')}
        <button
          className={`me-dropdown-button ${cleanPathname}`}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          {data.first_name.length ? data.first_name : data.username} {isDropdownOpen ? '▲' : '▼'}
        </button>
        {isDropdownOpen && (
          <div className={`me-dropdown-menu ${cleanPathname}`}>
            <a href={`/admin/auth/user/${data.id}/change/`} title="User settings">
              <ProfileCircle /> {t('login.profile')}
            </a>
            <a href="https://github.com/orgs/C2DH/projects/10" title="Github article workflow">
              <GithubCircle /> {t('login.githubArticleWorkflow')}
            </a>
            <a
              href={cleanPathname === 'dashboard' ? `/` : `/dashboard/`}
              title="Switch to dashboard"
            >
              <OpenInBrowser /> {t(`login.goJDH.${cleanPathname}`)}
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
        <div className={`me-avatar ${cleanPathname}`} style={{ background: avatarBg }}></div>
      </div>
    </div>
  )
}

export default Me

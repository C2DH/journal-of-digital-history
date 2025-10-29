import './Me.css'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJSON } from '../../logic/api/fetchData'
import { generateColorList } from './helper'

import { LogOut, OpenInBrowser, ProfileCircle } from 'iconoir-react'

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
              <ProfileCircle /> My profile
            </a>
            <a
              href={cleanPathname === 'dashboard' ? `/` : `/dashboard/`}
              title="Switch to dashboard"
            >
              <OpenInBrowser /> {cleanPathname === 'dashboard' ? 'Go to JDH' : 'Go to Dashboard'}
            </a>
            <a href={`/admin/logout/`} title="Log out">
              <LogOut /> Sign out
            </a>
          </div>
        )}
        <div className={`me-avatar ${cleanPathname}`} style={{ background: avatarBg }}></div>
      </div>
    </div>
  )
}

export default Me

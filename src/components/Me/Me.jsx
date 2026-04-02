import './Me.css'

import { GithubCircle, LogOut, OpenInBrowser, ProfileCircle } from 'iconoir-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'

import { DisplayLayerQueryParam, LayerNarrative } from '../../constants/globalConstants'

import DjangoIconBlack from '../../assets/images/django_logo_black.svg?url'
import DjangoIconBlue from '../../assets/images/django_logo_blue.svg?url'

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
  const ref = useRef(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await userLogoutRequest()
  }

  if (error || !data) return null

  return (
    <div className={`me ${path}`}>
      <div>
        {t('loggedInAs')}
        <button
          className={`me-dropdown-button ${path}`}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <span className="me-dropdown-username">
            {data.first_name.length ? data.first_name : data.username}
          </span>
          <span>{isDropdownOpen ? '▲' : '▼'}</span>
        </button>
        {isDropdownOpen && (
          <div className={`me-dropdown-menu ${path} ${layer}`} ref={ref}>
            <a href={`/admin/auth/user/${data.id}/change/`} title="User settings">
              <ProfileCircle /> {t('login.profile')}
            </a>
            <a href={`/admin/`} title="Django admin page">
              <img
                className="me-mydjango-icon"
                alt="Django icon"
                src={path === 'dashboard' ? DjangoIconBlue : DjangoIconBlack}
              />
              <span>Django admin page</span>
            </a>
            <a
              href={`${import.meta.env.VITE_GITHUB_ARTICLE_WORKFLOW}`}
              title="Github article workflow"
            >
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

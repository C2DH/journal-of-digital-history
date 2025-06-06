import { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router'

import Avatar from './components/Avatar/Avatar'
import Breadcrumb from './components/Breadcrumb/Breadcrumb'
import Login from './components/Login/Login'
import Navbar from './components/Navbar/Navbar'
import Search from './components/Search/Search'
import { navbarItems } from './constants/navbar'
import i18n from './i18next'
import AppRoutes from './routes'

import './styles/app.css'
import './styles/index.css'

function DashboardApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '')

  const handleLogin = (username: string) => {
    setIsLoggedIn(true)
    setUsername(username)
    localStorage.setItem('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter basename="/dashboard">
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          <Navbar items={navbarItems} />
          <div className="top-bar">
            <Breadcrumb />
            {/* TODO add search */}
            <div className="menu-bar">
              {' '}
              <Search onSearch={(q) => console.log(q)} activeRoutes={['/abstracts', '/articles']} />
              <Avatar username={username} onLogout={handleLogout} />
            </div>
          </div>
          <AppRoutes />
        </div>
      </I18nextProvider>
    </BrowserRouter>
  )
}

export default DashboardApp

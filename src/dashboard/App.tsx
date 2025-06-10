import { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router'
import UniversalCookie from 'universal-cookie'

import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Navbar from './components/Navbar/Navbar'
import { navbarItems } from './constants/navbar'
import i18n from './i18next'
import AppRoutes from './routes'

import './styles/index.css'

const cookies = new UniversalCookie()

function DashboardApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '')

  const handleLogin = (username: string) => {
    setIsLoggedIn(true)
    setUsername(username)
    cookies.set('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    cookies.remove('isLoggedIn')
    cookies.remove('username')
    cookies.remove('token')
    cookies.remove('refreshToken')
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter basename="/dashboard">
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          <Navbar items={navbarItems} />
          <Header username={username} onLogout={handleLogout} />
          <AppRoutes />
        </div>
      </I18nextProvider>
    </BrowserRouter>
  )
}

export default DashboardApp

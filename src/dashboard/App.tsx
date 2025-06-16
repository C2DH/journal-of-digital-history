import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import Login from '../components/Login/Login'
import { fetchUsername, userLogoutRequest } from '../logic/api/login'
import Header from './components/Header/Header'
import { navbarItems } from './components/Navbar/constant'
import Navbar from './components/Navbar/Navbar'
import i18n from './i18next'
import AppRoutes from './routes'
import './styles/index.css'

function DashboardApp() {
  const [username, setUsername] = useState<string>('Anonymous')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const handleLogout = async () => {
    await userLogoutRequest()
    setIsAuthenticated(false)
    setUsername('Anonymous')
  }

  useEffect(() => {
    fetchUsername()
      .then((name) => {
        setUsername(name || 'Anonymous')
        setIsAuthenticated(true)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
  }, [])

  if (isAuthenticated === false) {
    return <Login />
  }

  function DashboardApp() {
    return (
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          <Navbar items={navbarItems} />
          <Header username={username} onLogout={handleLogout} />
          <AppRoutes />
        </div>
      </I18nextProvider>
    )
  }
}

export default DashboardApp

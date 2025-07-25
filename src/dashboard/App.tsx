import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { I18nextProvider } from 'react-i18next'
import './styles/index.css'

import Login from '../components/Login/Login'
import { fetchUsername, userLogoutRequest } from '../logic/api/login'
import Header from './components/Header/Header'
import { navbarItems } from './components/Navbar/constant'
import Navbar from './components/Navbar/Navbar'
import i18n from './i18next'
import AppRoutes from './routes'

function DashboardApp() {
  const [username, setUsername] = useState<string>('Anonymous')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleLogout = async () => {
    await userLogoutRequest()
    setIsAuthenticated(false)
    setUsername('Anonymous')
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const name = await fetchUsername()
        setUsername(name || 'Anonymous')
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Login />
  }

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

export default DashboardApp

import './styles/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { I18nextProvider } from 'react-i18next'
import UniversalCookie from 'universal-cookie'

import Login from '../components/Login/Login'
import Me from '../components/Me/Me'
import { fetchUsername, userLogoutRequest } from '../logic/api/login'
import { navbarItems } from './components/Navbar/constant'
import Navbar from './components/Navbar/Navbar'
import Toast from './components/Toast/Toast'
import i18n from './i18next'
import AppRoutes from './routes'

const csrfToken = new UniversalCookie().get('csrftoken')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})

function DashboardApp() {
  // const [username, setUsername] = useState<string>('Anonymous')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleLogout = async () => {
    await userLogoutRequest()
    setIsAuthenticated(false)
    // setUsername('Anonymous')
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const name = await fetchUsername()
        // setUsername(name || 'Anonymous')
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
      <QueryClientProvider client={queryClient}>
        <div className="dashboard-app">
          <Toast />
          <Navbar items={navbarItems} />
          {typeof csrfToken === 'string' && <Me />}
          <AppRoutes />
        </div>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default DashboardApp

import './styles/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { I18nextProvider } from 'react-i18next'

import Login from '../components/Login/Login'
import { fetchUsername } from '../logic/api/login'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import Toast from './components/Toast/Toast'
import i18n from './i18next'
import AppRoutes from './routes'
import { navbarItems } from './utils/constants/navbar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})

function DashboardApp() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const name = await fetchUsername()
        if (name) {
          console.info('[Dashboard] Success checking authentication')
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.info('[Dashboard] Error checking authentication:', error)
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
          <Header />
          <AppRoutes />
        </div>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default DashboardApp

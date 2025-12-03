import './styles/index.css'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
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

function AuthGate() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth:me'],
    queryFn: fetchUsername,
  })

  if (isLoading) return <Spinner />
  if (!user) return <Login />

  return (
    <>
      <Toast />
      <Navbar items={navbarItems} />
      <Header />
      <AppRoutes />
    </>
  )
}

function DashboardApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          <AuthGate />
        </div>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default DashboardApp

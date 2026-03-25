import './styles/index.css'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'

import Login from '../components/Login/Login'
import { fetchUsername } from '../logic/api/login'
import Blob from './components/Blob/Blob'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import Toast from './components/Toast/Toast'
import i18n from './i18next'
import AppRoutes from './routes'

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

  if (isLoading) return <Blob />
  if (!user || isError) return <Login />

  return (
    <main>
      <Suspense fallback={<Blob />}>
        <Toast />
        <Navbar />
        <Header />
        <AppRoutes />
      </Suspense>
    </main>
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

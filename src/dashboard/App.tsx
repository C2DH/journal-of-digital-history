import './styles/index.css'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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

function DelayedRender({
  children,
  minDelay = 1500,
}: {
  children: React.ReactNode
  minDelay?: number
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), minDelay)
    return () => clearTimeout(timer)
  }, [minDelay])

  if (!ready) return <Blob />

  return <>{children}</>
}

function AuthGate() {
  const {
    data: user,
    isLoading,

    isError,
  } = useQuery({
    queryKey: ['auth:me'],
    queryFn: fetchUsername,
  })

  if (!user) return <Login />

  return (
    <>
      {' '}
      {/* <DelayedRender minDelay={2000}> */}
      <Toast />
      <Navbar />
      <Header />
      <AppRoutes />
      {/* </DelayedRender> */}
    </>
  )
}

function DashboardApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          {/* <Suspense fallback={<Blob />}> */}
          <AuthGate />
          {/* </Suspense> */}
        </div>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default DashboardApp

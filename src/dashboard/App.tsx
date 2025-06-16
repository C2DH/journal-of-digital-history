import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
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

const csrfToken = new UniversalCookie().get('csrftoken')
console.info('%ccsrftoken', 'font-weight: bold', csrfToken)

axios
  .get('/api/me', {
    headers: {
      'X-CSRFToken': csrfToken,
    },
  })
  .then((response) => {
    console.info('%cUser data', 'font-weight: bold', response.data)
  })
  .catch((error) => {
    console.error('%cError fetching user data', 'color: red', error)
  })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    },
  },
})

function DashboardApp() {
  return (
    <BrowserRouter basename="/tartempion">
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <div className="dashboard-app">
            <Navbar items={navbarItems} />
            <Header username={username} onLogout={handleLogout} />
            <AppRoutes />
          </div>
        </QueryClientProvider>
      </I18nextProvider>
    </BrowserRouter>
  )
}

export default DashboardApp

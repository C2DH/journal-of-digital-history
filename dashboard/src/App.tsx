import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router'

import Navbar from './components/Navbar/Navbar'
import { navbarItems } from './constants/navbar'
import i18n from './i18next'
import AppRoutes from './routes'

import './styles/index.css'

function DashboardApp() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          <Navbar items={navbarItems} />
          <AppRoutes />
        </div>
      </I18nextProvider>
    </BrowserRouter>
  )
}

export default DashboardApp

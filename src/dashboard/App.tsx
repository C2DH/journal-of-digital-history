import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router'

import Breadcrumb from './components/Breadcrumb/Breadcrumb'
import Navbar from './components/Navbar/Navbar'
import Search from './components/Search/Search'
import { navbarItems } from './constants/navbar'
import i18n from './i18next'
import AppRoutes from './routes'

import './styles/app.css'
import './styles/index.css'

function DashboardApp() {
  return (
    <BrowserRouter basename="/dashboard">
      <I18nextProvider i18n={i18n}>
        <div className="dashboard-app">
          <Navbar items={navbarItems} />
          <div className="top-bar">
            <Breadcrumb />
            {/* TODO add search */}
            <Search onSearch={(q) => console.log(q)} activeRoutes={['/abstracts', '/articles']} />
          </div>
          <AppRoutes />
        </div>
      </I18nextProvider>
    </BrowserRouter>
  )
}

export default DashboardApp

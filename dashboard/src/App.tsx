
import Navbar from "./components/Navbar/Navbar"
import LandingPage from "./pages/LandingPage"

import { navbarItems } from './constants/navbar'

import './styles/index.css'

function DashboardApp() {

  return (
    <div className="dashboard-app">
        <Navbar items = {navbarItems} />
        <LandingPage />
    </div>
  )
}

export default DashboardApp

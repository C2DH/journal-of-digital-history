import { I18nextProvider } from 'react-i18next'
import Navbar from "./components/Navbar/Navbar"
import LandingPage from "./pages/LandingPage"

import { navbarItems } from './constants/navbar'
import i18n from './i18next'

import './styles/index.css'

function App() {

  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <Navbar items = {navbarItems} />
        <LandingPage />
      </I18nextProvider>
    </div>
  )
}

export default App

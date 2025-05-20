import Navbar from "./components/Navbar/Navbar"

import { navbarItems } from './constants/navbar'
import LandingPage from "./pages/LandingPage"
import './styles/index.css'

function App() {

  return (
    <div className="App">
      <Navbar items = {navbarItems} />
      <LandingPage />
    </div>
  )
}

export default App

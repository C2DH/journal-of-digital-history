import Navbar from "./components/Navbar/Navbar"

import { navbarItems } from './constants/navbar'
import './styles/index.css'

function App() {

  return (
    <div className="App">
      <Navbar items = {navbarItems} />
    </div>
  )
}

export default App

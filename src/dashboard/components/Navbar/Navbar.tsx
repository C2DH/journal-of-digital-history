import './Navbar.css'

import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import Logo from '../../../../src/components/Logo'
import BurgerMenu from '../../../assets/icons/BurgerMenu'
import { navbarItems } from '../../utils/constants/navbar'

const Navbar = () => {
  const location = useLocation()
  const [activeHref, setActiveHref] = useState(location.pathname.split('/')[1])
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false)

  useEffect(() => {
    setActiveHref(location.pathname.split('/')[1])
  }, [location])

  const toggleMenu = () => {
    setBurgerMenuOpen(!isBurgerMenuOpen)
  }

  const closeMenu = () => {
    setBurgerMenuOpen(false)
  }

  return (
    <div className="navbar">
      <button className="burger-menu" onClick={toggleMenu}>
        <BurgerMenu />
      </button>
      <div className={`navbar-header `}>
        <a className="navbar-logo " href="/">
          <Logo />
          <p>Journal of Digital History</p>
        </a>
      </div>
      <ul className={isBurgerMenuOpen ? 'menu-open' : ''}>
        {navbarItems.map((item) => (
          <li key={item.href} className={activeHref === item.href ? 'active' : ''}>
            <RouterLink to={`${item.href}`} className="navbar-link" onClick={closeMenu}>
              <span className="navbar-icons">
                {item.iconOutlined}
                {item.iconFilled}
              </span>
              <span className="navbar-labels">{item.label}</span>
            </RouterLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Navbar

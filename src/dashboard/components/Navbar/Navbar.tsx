import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import { NavbarProps } from './interface'

import Logo from '../../../../src/components/Logo'

const Navbar = ({ items }: NavbarProps) => {
  const location = useLocation()
  const [activeHref, setActiveHref] = useState(location.pathname.split('/')[1])

  useEffect(() => {
    setActiveHref(location.pathname.split('/')[1])
  }, [location])

  return (
    <div className="navbar">
      <div className="navbar-header">
        <a className="navbar-logo " href="/">
          <Logo />
          <p>Journal of Digital History</p>
        </a>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.href} className={activeHref === item.href ? 'active' : ''}>
            <Link to={`${item.href}`} className="navbar-link">
              <span className="material-symbols-outlined navbar-icons">{item.icon}</span>
              <span className="navbar-labels">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Navbar

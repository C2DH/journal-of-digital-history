import { useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../../../../src/components/Logo'
import { PATH_PREFIX } from '../../constants/global'
import { NavbarProps } from '../../interface/navbar'

import './Navbar.css'

const Navbar = ({ items }: NavbarProps) => {
  const [activeHref, setActiveHref] = useState(items[0].href)

  return (
    <div className="navbar">
      <div className="navbar-header">
        <Logo />
        <p>Journal of Digital History</p>
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item.href}
            className={activeHref === item.href ? 'active' : ''}
            onClick={() => setActiveHref(item.href)}
          >
            <span className="material-symbols-outlined navbar-icons">{item.icon}</span>
            <Link to={`${PATH_PREFIX}${item.href}`}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Navbar

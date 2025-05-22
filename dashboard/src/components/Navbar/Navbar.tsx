import { useState } from 'react'
import Logo from '../../../../src/components/Logo'

import { NavbarProps } from '../../interface/navbar'
import './Navbar.css'

const Navbar = ({items}: NavbarProps) => {
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
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Navbar

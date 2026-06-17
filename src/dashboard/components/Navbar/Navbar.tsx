import './Navbar.css'

import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { useNavStore } from '../../store'
import { navbarItems } from '../../utils/constants/navbar'

const Navbar = () => {
  const location = useLocation()
  const [activeHref, setActiveHref] = useState(location.pathname.split('/')[1])

  const { isOpen, close } = useNavStore()

  useEffect(() => {
    setActiveHref(location.pathname.split('/')[1])
  }, [location])

  return (
    <div className="navbar">
      <ul className={isOpen ? 'menu-open' : ''}>
        {navbarItems.map((item) => (
          <li key={item.href} className={activeHref === item.href ? 'active' : ''}>
            <RouterLink to={`${item.href}`} className="navbar-link" onClick={close}>
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

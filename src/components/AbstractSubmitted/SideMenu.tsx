import React, {useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import { SideMenuProps } from '../../interfaces/abstractSubmitted'

const SideMenu = ({ activeSection, onMenuClick, menuItems }: SideMenuProps) => {
  const { t } = useTranslation()

  useEffect(() => {
    const element = document.getElementById(activeSection)

    if (element) {
      const offset = -100
      const elementRect = element.getBoundingClientRect().top
      const offsetPosition = elementRect + window.scrollY + offset

      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }, 15)
    }
  }, [activeSection])

  return (
    <div className="side-menu">
      <ul className="list-unstyled">
        {menuItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => onMenuClick(item.id)}
              className={`navbar-brand ${activeSection === item.id ? 'active' : ''}`}
            >
              {t(item.label)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideMenu

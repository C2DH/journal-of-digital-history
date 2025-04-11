import React from 'react'
import { useTranslation } from 'react-i18next'

interface SideMenuProps {
  activeSection: string
  onMenuClick: (section: string) => void
  menuItems: Array<{ id: string; label: string }>
  height: number
}

const SideMenu = ({ activeSection, onMenuClick, menuItems, height }: SideMenuProps) => {
  const { t } = useTranslation()

  return (
    <div className="side-menu" style={{ top: `${height}px` }}>
      <ul className="list-unstyled">
        {menuItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => 
                onMenuClick(item.id)
              }
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

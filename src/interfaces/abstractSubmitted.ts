export interface SideMenuProps {
    activeSection: string
    onMenuClick: OnMenuClick
    menuItems: Array<{ id: string; label: string }>
  }

type OnMenuClick = (section: string) => void
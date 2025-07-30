import './Header.css'

import { HeaderProps } from './interface'

import Avatar from '../Avatar/Avatar'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

const Header = ({ username, onLogout }: HeaderProps) => (
  <div className="top-bar">
    <Breadcrumb />
    <div className="menu-bar">
      <Avatar username={username} onLogout={onLogout} />
    </div>
  </div>
)

export default Header

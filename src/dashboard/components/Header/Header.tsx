import './Header.css'

import { HeaderProps } from './interface'

import Avatar from '../Avatar/Avatar'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import Search from '../Search/Search'

const Header = ({ username, onLogout }: HeaderProps) => (
  <div className="top-bar">
    <Breadcrumb />
    {/* TODO add search */}
    <div className="menu-bar">
      <Search onSearch={(q) => console.log(q)} activeRoutes={['/abstracts', '/articles']} />
      <Avatar username={username} onLogout={onLogout} />
    </div>
  </div>
)

export default Header

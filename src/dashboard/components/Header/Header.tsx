import Avatar from '../Avatar/Avatar'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import Search from '../Search/Search'

import './Header.css'

interface HeaderProps {
  username: string
  onLogout: () => void
}

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

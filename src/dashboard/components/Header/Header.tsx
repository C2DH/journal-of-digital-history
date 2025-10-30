import './Header.css'

import Me from '../../../components/Me/Me'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

const Header = () => (
  <div className="top-bar">
    <Breadcrumb />
    <Me />
  </div>
)

export default Header

import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import './Breadcrumb.css'

const Breadcrumb = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
      <Link to="/">Home </Link>
      {pathnames.map((value, idx) => {
        if (value != 'home') {
          const to = '/' + pathnames.slice(0, idx + 1).join('/')
          const isLast = idx === pathnames.length - 1
          return (
            <span key={to}>
              &nbsp;{'> '}
              {isLast ? value : <Link to={to}>{value}</Link>}
            </span>
          )
        }
      })}
    </nav>
  )
}

export default Breadcrumb

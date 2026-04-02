import './Header.css'

import { useEffect, useRef } from 'react'

import LogoBlue from '../../../assets/icons/LogoBlue'
import Me from '../../../components/Me/Me'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

const Header = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (ref.current) {
        ref.current.classList.toggle('scrolled', window.scrollY > 10)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="top-bar" ref={ref}>
      <div className="top-bar-left">
        <a className="navbar-logo" href="/">
          <LogoBlue />
          <p>
            Journal of <br />
            Digital History
          </p>
        </a>{' '}
      </div>
      <Breadcrumb />
      <Me />
    </div>
  )
}

export default Header

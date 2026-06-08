import './Header.css'

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import BurgerMenu from '../../../assets/icons/BurgerMenu'
import LogoBlue from '../../../assets/icons/LogoBlue'
import Me from '../../../components/Me/Me'
import { useActionStore, useItemStore, useNavStore } from '../../store'
import { isTypeAbstract, isTypeArticle } from '../../utils/helpers/checkItem'
import { toRow } from '../../utils/helpers/details'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import ActionButtonLarge from '../Buttons/ActionButton/Large/ActionButtonLarge'

const Header = () => {
  const { pathname } = useLocation()
  const isDetailPage = pathname.split('/')[2] !== undefined
  const ref = useRef<HTMLDivElement>(null)

  const { toggle } = useNavStore()
  const { data: item } = useItemStore()
  const { getRowActions } = useActionStore()

  const isArticle = isTypeArticle(item)
  const isAbstract = isTypeAbstract(item)

  const row = toRow(item, isArticle, isAbstract)
  const actions = row ? getRowActions(row, isArticle) : []

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
      <button
        type="button"
        className="burger-menu"
        onClick={toggle}
        aria-label="Toggle navigation menu"
      >
        <BurgerMenu />
      </button>
      <Breadcrumb />
      {isDetailPage && <ActionButtonLarge actions={actions} active={actions.length > 0} />}
      <Me />
    </div>
  )
}

export default Header

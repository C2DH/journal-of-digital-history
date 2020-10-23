import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Nav, Navbar, Container } from 'react-bootstrap'
import SwitchLanguage from '../SwitchLanguage'
import SwitchLanguageLink from '../SwitchLanguage/SwitchLanguageLink'
import LangNavLink from '../LangNavLink'
import UserProfile from './UserProfile'
import logo from '../../assets/images/jdh-logo.svg'
import deGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo.svg'
import uniluLogo from '../../assets/images/unilu-c2dh-logo.png'
import styles from './Header.module.scss'
const PrimaryRoutes = [
  { to:'/', label: 'navigation.home'},
  { to: '/references', label: 'navigation.references' },
  { to: '/datasets', label: 'navigation.datasets' },
  { to: '/submit', label: 'navigation.submit' },
  { to: '/about', label: 'navigation.about' }
]

const MobileHeader = ({ langs }) => {
  const { t, i18n } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  return (
    <Nav className={`${styles.MobileHeaderNav} d-block d-sm-none`}>
      <div className={styles.MobileHeaderToggler}
        onClick={() => setIsVisible(!isVisible)}
      >menu</div>
      <div className={styles.MobileHeaderMenu} style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100vh)'
      }}>
        <div className="m-4 pb-4 border-bottom">
        {PrimaryRoutes.map(({to, label},i) => (
          <Nav.Item key={`primary-route-${i}`}>
            <LangNavLink className={styles.MobileHeaderNavLink} to={to} exact>{t(label)}</LangNavLink>
          </Nav.Item>
        ))}
        </div>
        <div className="m-4 pb-4">
        {langs.map((lang, i) => (
          <Nav.Item key={`lang-switch-${i}`}>
            <SwitchLanguageLink
              lang={lang}
              onClick={() => {
                i18n.changeLanguage(lang)
              }}
              className={styles.MobileHeaderNavLink}>{lang.split('_')[0]}</SwitchLanguageLink>
          </Nav.Item>
        ))}
        </div>
        <div className="m-4 pb-4 d-flex align-items-center">
          <div className="w-50"><img alt='C2DH - University of Luxembourg' src={uniluLogo} style={{width:'200px'}}/></div>
          <div className="w-50"><img alt='De Gruyter Publisher' src={deGruyterLogo} style={{width:'150px'}}/></div>
        </div>
      </div>
    </Nav>
  )
}

const Header = ({ availableLanguages, isAuthDisabled }) => {
  const { t } = useTranslation()

  // console.info('header render with lang:', lang);
  return (
    <Navbar className={styles.Navbar} fixed="top" variant="light" expand="md">
    <Container>
      <Navbar.Brand href="#home" className="d-flex align-items-center">
        <div className={`${styles.BrandImage} brand-image flex-grow-1 mr-1`} style={{
          backgroundImage: `url(${logo})`,
        }}></div>
        <span className="d-md-block d-none">{t('Journal of Digital history')}</span>
      </Navbar.Brand>
      <Nav className="ml-auto d-md-flex d-none">
        {PrimaryRoutes.map(({to, label}, i) => (
          <Nav.Item key={`primary-route-${i}`}>
            <LangNavLink to={to} exact>{t(label)}</LangNavLink>
          </Nav.Item>
        ))}
        <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>
        {!isAuthDisabled && <UserProfile/>}
      </Nav>
      <MobileHeader langs={availableLanguages}/>
    </Container>
  </Navbar>)
}


export default Header

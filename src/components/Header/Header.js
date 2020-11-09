import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap'
import SwitchLanguage from '../SwitchLanguage'
import SwitchLanguageLink from '../SwitchLanguage/SwitchLanguageLink'
import LangNavLink from '../LangNavLink'
import UserProfile from './UserProfile'
import logo from '../../assets/images/jdh-logo.svg'
import deGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo.svg'
import uniluLogo from '../../assets/images/unilu-c2dh-logo.png'
import styles from './Header.module.scss'
import { PrimaryRoutes } from '../../constants'
import SwitchNightMode from '../SwitchNightMode'


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

const NavPrimaryRoutes = ({ routes, ...props}) => {
  const { t } = useTranslation()
  return (
    <Nav {...props}>
      {routes.map(({to, label}, i) => (
        <Nav.Item key={`primary-route-${i}`}>
          <LangNavLink to={to} exact>{t(label)}</LangNavLink>
        </Nav.Item>
      ))}
      {props.children}
    </Nav>
  )
}



const RowHeader = ({ availableLanguages, isAuthDisabled }) => {
  const { t } = useTranslation()
  return (
    <Navbar className={`${styles.Navbar} pt-3`} variant="light" expand="md">
    <Navbar.Brand href="#home" className="position-absolute d-flex align-items-center">
      <div className={`${styles.BrandImage}`} style={{
        backgroundImage: `url(${logo})`,
      }}></div>
      <span className="d-md-block d-none">Journal of Digital History</span>
    </Navbar.Brand>
    <Container>
      <Row className="w-100 ml-auto d-md-flex d-none">
        <Col md={{offset: 2, span: 6}} className="pb-3">
          <NavPrimaryRoutes routes={PrimaryRoutes} />
        </Col>
        <Col md={3}>
          <Nav className="pb-3 mr-auto">
            <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>
            {!isAuthDisabled && <UserProfile/>}
            <Nav.Item><SwitchNightMode /></Nav.Item>
          </Nav>
        </Col>
        <MobileHeader langs={availableLanguages}/>
      </Row>
    </Container>
    </Navbar>
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
        <span className="d-md-block d-none">Journal of <br/>Digital History</span>
      </Navbar.Brand>
      <NavPrimaryRoutes className="ml-auto d-md-flex d-none" routes={PrimaryRoutes}>
        <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>
        {!isAuthDisabled && <UserProfile/>}

      </NavPrimaryRoutes>
      <MobileHeader langs={availableLanguages}/>
    </Container>
  </Navbar>)
}

export default RowHeader

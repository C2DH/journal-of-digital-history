import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap'
import SwitchLanguage from '../SwitchLanguage'
import SwitchLanguageLink from '../SwitchLanguage/SwitchLanguageLink'
import LangNavLink from '../LangNavLink'
import UserProfile from './UserProfile'
import logo from '../../assets/images/jdh-logo.svg'
import deGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo_white.svg'
import uniluLogo from '../../assets/images/unilu-c2dh-logo-white.svg'
import { PrimaryRoutes, TermsOfUseRoute } from '../../constants'
import SwitchNightMode from '../SwitchNightMode'
import '../../styles/components/Header.scss'
import { useOnScreen } from '../../hooks/graphics'

const MobileHeader = ({ langs, displayLangs }) => {
  const { t, i18n } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  return (
    <>
    <LangNavLink to="/" className="MobileHeaderBrand" >{t('titleInline')}</LangNavLink>
    <Nav className="MobileHeaderNav d-block d-md-none">
      <div className="MobileHeaderToggler"
        onClick={() => setIsVisible(!isVisible)}
      >menu ☰</div>
      <div className="MobileHeaderMenu" style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100vh)'
      }}>
        <div className="mx-3 mt-4 pb-4">
        <h1>{t('titleInline')}</h1>
        {PrimaryRoutes.concat([TermsOfUseRoute]).map(({to, label},i) => (
          <Nav.Item className="MobileHeaderNavItem" key={`primary-route-${i}`}>
            <LangNavLink to={to} exact onClick={() => setIsVisible(false)}>{t(label)}</LangNavLink>
          </Nav.Item>
        ))}
        </div>
        <div className="mx-3 pb-4">
        {!!displayLangs && (
          <h4 className="text-white monospace font-weight-bold" style={{textTransform: 'uppercase', fontSize: 'inherit'}}>
          change language
          </h4>
        )}
        {!!displayLangs && langs.map((lang, i) => (
          <Nav.Item key={`lang-switch-${i}`} className="MobileHeaderNavItem">
            <SwitchLanguageLink
            style={{
              padding: '0.5rem 1rem'
            }}
              lang={lang}
              onClick={() => {
                i18n.changeLanguage(lang)
              }}>{lang.split('-')[0]}</SwitchLanguageLink>
          </Nav.Item>
        ))}
        </div>
        <div className="m-4 pb-4 d-flex align-items-center">
          <a className="w-50 d-block" href="https://c2dh.uni.lu" target="_blank" rel="noopener noreferrer"><img alt='C2DH - University of Luxembourg' src={uniluLogo} style={{width:170, marginLeft: -10}}/></a>
          <a className="w-50 d-block" href="https://www.degruyter.com" target="_blank" rel="noopener noreferrer"><img alt='De Gruyter Publisher' src={deGruyterLogo} style={{ width: 170}}/></a>
        </div>
      </div>
    </Nav>
    </>
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



const RowHeader = ({ availableLanguages, isAuthDisabled, displayLangs, displayLogin }) => {
  const { t } = useTranslation()
  const [{ intersectionRatio }, ref] = useOnScreen()

  return (
    <header ref={ref} className={`${intersectionRatio < 1 ? 'active' : ''}`}>
    <div className="position-fixed w-100" id="Header_background" style={{left: 0, zIndex:1 ,top:0, height: 100}}/>
    <Navbar  style={{height: 100 }} className="RowHeader d-md-flex d-none fixed-top"  variant="light" expand="md">
    <Navbar.Brand href="/en" className="position-absolute d-flex align-items-center">
      <div className="BrandImage" style={{
        backgroundImage: `url(${logo})`,
      }}></div>
      <span className="d-md-block d-none" dangerouslySetInnerHTML={{
        __html: t('title')
      }}></span>
    </Navbar.Brand>
    <Container className="d-block" style={{height:80}}>
      <Row className="d-md-flex d-none align-items-center h-100">
        <Col md={{offset: 2, span: 8}}>
          <NavPrimaryRoutes className="" routes={PrimaryRoutes} />
        </Col>
        {displayLogin || displayLangs ?(
          <Col md={2}>
            <Nav className="justify-content-end">
              {!!displayLangs && <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>}
              {!!displayLogin && !isAuthDisabled && <UserProfile/>}
              <Nav.Item className='d-none'><SwitchNightMode /></Nav.Item>
            </Nav>
          </Col>
        ): null}
      </Row>
    </Container>
    </Navbar>
    <MobileHeader langs={availableLanguages}/>
    </header>
  )
}

// const Header = ({ availableLanguages, isAuthDisabled }) => {
//   const { t } = useTranslation()
//
//   // console.info('header render with lang:', lang);
//   return (
//     <Navbar className=Navbar} fixed="top" variant="light" expand="md">
//     <Container>
//       <Navbar.Brand href="#home" className="d-flex align-items-center">
//         <div className={`${styles.BrandImage} brand-image flex-grow-1 mr-1`} style={{
//           backgroundImage: `url(${logo})`,
//         }}></div>
//         <span className="d-md-block d-none">Journal of <br/>Digital History</span>
//       </Navbar.Brand>
//       <NavPrimaryRoutes className="ml-auto d-md-flex d-none" routes={PrimaryRoutes}>
//         <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>
//         {!isAuthDisabled && <UserProfile/>}
//
//       </NavPrimaryRoutes>
//       <MobileHeader langs={availableLanguages}/>
//     </Container>
//   </Navbar>)
// }

export default RowHeader

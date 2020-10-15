import React from 'react'
import { useTranslation } from 'react-i18next'
import { Nav, Navbar, Container } from 'react-bootstrap'
import SwitchLanguage from '../SwitchLanguage'
import LangNavLink from '../LangNavLink'
import UserProfile from './UserProfile'
import logo from '../../assets/images/jdh-logo.svg'

export default function Header({ availableLanguages, isAuthDisabled }) {
  const { t } = useTranslation()
  // console.info('header render with lang:', lang);
  return (
    <Navbar className='border-bottom' fixed="top" bg="light" variant="light" expand="md">
    <Container>
      <Navbar.Brand href="#home" className="d-flex align-items-center">
        <img
          alt=""
          src={logo}
          height="25px"
          className="flex-grow-1 mr-1"
        />
        <span>Journal of Digital history</span>
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Item>
          <LangNavLink to="/" exact>{t('navigation.home')}</LangNavLink>
        </Nav.Item>
        <Nav.Item>
          <LangNavLink to="/references" exact>{t('navigation.references')}</LangNavLink>
        </Nav.Item>
        <Nav.Item>
          <LangNavLink to="/datasets" exact>{t('navigation.datasets')}</LangNavLink>
        </Nav.Item>
        <Nav.Item>
          <LangNavLink to="/submit" exact>{t('navigation.submit')}</LangNavLink>
        </Nav.Item>
        <Nav.Item>
          <LangNavLink to="/about" exact>{t('navigation.about')}</LangNavLink>
        </Nav.Item>
        <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>
        {!isAuthDisabled && <UserProfile/>}
      </Nav>
    </Container>
  </Navbar>)
}
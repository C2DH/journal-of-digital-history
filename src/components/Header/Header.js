import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Nav, Navbar, Container } from 'react-bootstrap'
import SwitchLanguage from '../SwitchLanguage'
import logo from '../../assets/images/jdh-logo.svg'

export default function Header({ lang, availableLanguages }) {
  const { t } = useTranslation()
  // console.info('header render with lang:', lang);
  return (
    <Navbar fixed="top" bg="light" variant="light" className="border-bottom">
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
          <Nav.Link as={NavLink} to={`/${lang}`} exact>{t('navigation.home')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`/${lang}/references`} exact>{t('navigation.references')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`/${lang}/datasets`} exact>{t('navigation.datasets')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`/${lang}/submit`} exact>{t('navigation.submit')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to={`/${lang}/about`} exact>{t('navigation.about')}</Nav.Link>
        </Nav.Item>
        <SwitchLanguage className='nav-item' title={t('language')} langs={availableLanguages}></SwitchLanguage>
      </Nav>
    </Container>
  </Navbar>)
}
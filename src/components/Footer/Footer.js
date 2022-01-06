import React from 'react'
import LangNavLink from '../LangNavLink'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import {
  HomeRoute,
  // ReferencesRoute,
  // DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute,
  TermsOfUseRoute
} from '../../constants'
import DeGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo_Oldenbourg.svg'
import UniluLogo from '../../assets/images/unilu-c2dh-logo.svg'
import styles from './Footer.module.scss'


const now = new Date()


const Footer = ({ hideOnRoutes=[]}) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  if (hideOnRoutes.some((d) => pathname.indexOf(d) !== -1)) {
    console.debug('[Footer] hidden following hideOnRoutes:', hideOnRoutes, 'with pathname:', pathname)
    return null
  }
  return (
    <>
      <Container className="py-5">
        <Row>
          <Col md={{span: 3, offset:2}}>
          © <a href="https://www.uni.lu/" target="_blank" rel="noopener noreferrer">University of Luxembourg</a><br/>
          © <a href="https://www.degruyter.com" target="_blank" rel="noopener noreferrer"> De Gruyter</a> {now.getFullYear()}
          <p className="mt-2" dangerouslySetInnerHTML={{__html: t('contactUsingEmail')}}></p>
          </Col>
          <Col md={3}>
            <Nav className="flex-column">
              <Nav.Item><LangNavLink to={HomeRoute.to} exact>{t(HomeRoute.label)}</LangNavLink></Nav.Item>
              <Nav.Item><LangNavLink to={AbstractSubmissionRoute.to} exact>{t(AbstractSubmissionRoute.label)}</LangNavLink></Nav.Item>
            </Nav>
          </Col>
          <Col md={2}>
            <Nav className="flex-column">
              <Nav.Item><LangNavLink to={AboutRoute.to} exact>{t(AboutRoute.label)}</LangNavLink></Nav.Item>
              <Nav.Item><LangNavLink to={TermsOfUseRoute.to} exact>{t(TermsOfUseRoute.label)}</LangNavLink></Nav.Item>
              {/*
                <Nav.Item><LangNavLink to={ReferencesRoute.to} exact>{t(ReferencesRoute.label)}</LangNavLink></Nav.Item>
                <Nav.Item><LangNavLink to={DatasetsRoute.to} exact>{t(DatasetsRoute.label)}</LangNavLink></Nav.Item>
              */}
            </Nav>
          </Col>
          {/*
            <Col md={3}>
              <Nav className="flex-column">
                <Nav.Item><LangNavLink to={AboutRoute.to} exact>{t(AboutRoute.label)}</LangNavLink></Nav.Item>
                <Nav.Item><LangNavLink to={TermsOfUseRoute.to} exact>{t(TermsOfUseRoute.label)}</LangNavLink></Nav.Item>
              </Nav>
            </Col>
          */}
        </Row>
        <Row>
          <Col md={{span: 8, offset:2}}>
            <div className="position-relative border-top border-dark pt-5 my-5" style={{minHeight:200}}>
              <a className={styles.LogoLink} href="https://c2dh.uni.lu" target="_blank" rel="noopener noreferrer" style={{
                left: 0,
                marginLeft: -20
              }}>
                <img alt='C²DH - University of Luxembourg' src={UniluLogo} style={{width: 300}}/>
              </a>
              <a className={`${styles.LogoLinkDeGruyter} ${styles.LogoLink}`} href="https://www.degruyter.com" target="_blank" rel="noopener noreferrer"  style={{
                left:'50%'
              }}><img className="ml-2" alt='De Gruyter Publisher' src={DeGruyterLogo} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      </>
    )
}

export default Footer

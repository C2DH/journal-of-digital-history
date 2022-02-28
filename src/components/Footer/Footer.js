import React from 'react'
import LangNavLink from '../LangNavLink'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import {
  BootstrapFullColumLayout,
  HomeRoute,
  // ReferencesRoute,
  // DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute,
  ReleaseNotesRoute,
  TermsOfUseRoute
} from '../../constants'
import DeGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo_Oldenbourg.svg'
import UniluLogo from '../../assets/images/unilu-c2dh-logo.svg'
import '../../styles/components/Footer.scss'


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
      <Container className="Footer py-5">
        <Row>
          <Col {...BootstrapFullColumLayout}>
            <div className="d-flex justify-content-between">
              <div>
                © <a href="https://www.uni.lu/" target="_blank" rel="noopener noreferrer">University of Luxembourg</a><br/>
                © <a href="https://www.degruyter.com" target="_blank" rel="noopener noreferrer"> De Gruyter</a> {now.getFullYear()}
                <p className="mt-2" dangerouslySetInnerHTML={{__html: t('contactUsingEmail')}}></p>
              </div>
              <div>
                <Nav className="flex-column">
                  {[HomeRoute, AbstractSubmissionRoute].map((route, i) => (
                    <Nav.Item key={i}>
                      <LangNavLink to={route.to} exact>
                        <span>{t(route.label)}</span>
                      </LangNavLink>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
              <div>
                <Nav className="flex-column">
                  {[AboutRoute, ReleaseNotesRoute, TermsOfUseRoute].map((route, i) => (
                    <Nav.Item key={i}>
                      <LangNavLink to={route.to} exact>
                        <span>{t(route.label)}</span>
                      </LangNavLink>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
            </div>
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
          <Col {...BootstrapFullColumLayout}>
            <div className="position-relative border-top border-dark pt-5 my-5" style={{minHeight:200}}>
              <a className="Footer_logoLink" href="https://c2dh.uni.lu" target="_blank" rel="noopener noreferrer" style={{
                left: 0,
                marginLeft: -20
              }}>
                <img alt='C²DH - University of Luxembourg' src={UniluLogo} style={{width: 300}}/>
              </a>
              <a className="Footer_logoLinkDeGruyter" href="https://www.degruyter.com" target="_blank" rel="noopener noreferrer"  style={{
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

import React from 'react'
import LangNavLink from '../LangNavLink'
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
import DeGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo.svg'
import UniluLogo from '../../assets/images/unilu-c2dh-logo.svg'

const now = new Date()


const Footer = () => {
  const { t } = useTranslation()

  return (
    <>
      <Container className="py-5">
        <Row>
          <Col md={{span: 3, offset:2}}>
          © <a href="https://www.uni.lu/">Université du Luxembourg</a><br/> © De Gruyter {now.getFullYear()}
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
            <div className="position-relative border-top border-dark pt-5 mt-5" style={{height:200}}>
              <a href="https://www.uni.lu" target="_blank" rel="noopener noreferrer" className="position-absolute" style={{
                left: 0,
                marginLeft: -20,
              }}>
                <img alt='C2DH - University of Luxembourg' src={UniluLogo} style={{width: 300}}/>
              </a>
              <a href="https://www.degruyter.com" target="_blank" className="position-absolute" rel="noopener noreferrer"  style={{
                left:'50%',
                marginLeft: 20,
              }}><img className="ml-2" alt='De Gruyter Publisher' src={DeGruyterLogo} style={{width: 200}}/>
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      </>
    )
}

export default Footer

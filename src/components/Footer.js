import React from 'react'
import LangNavLink from './LangNavLink'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap'
import {
  HomeRoute,
  ReferencesRoute,
  DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute
} from '../constants'
const now = new Date()


const Footer = () => {
  const { t } = useTranslation()

  return (<Navbar variant="light" expand="md">
      <Container className="py-5" style={{
        borderTop: '1px solid var(--secondary)'
      }}>
        <Row className=" w-100">
          <Col md={3}>
          Dislaimer @University {now.getFullYear()}
          </Col>
          <Col md={3}>
            <Nav className="flex-column">
              <Nav.Item><LangNavLink to={HomeRoute.to} exact>{t(HomeRoute.label)}</LangNavLink></Nav.Item>
            </Nav>
          </Col>
          <Col md={3}>
            <Nav className="flex-column">
              <Nav.Item><LangNavLink to={AbstractSubmissionRoute.to} exact>{t(AbstractSubmissionRoute.label)}</LangNavLink></Nav.Item>
              <Nav.Item><LangNavLink to={ReferencesRoute.to} exact>{t(ReferencesRoute.label)}</LangNavLink></Nav.Item>
              <Nav.Item><LangNavLink to={DatasetsRoute.to} exact>{t(DatasetsRoute.label)}</LangNavLink></Nav.Item>

            </Nav>
          </Col>
          <Col md={3}>
            <Nav className="flex-column">
              <Nav.Item><LangNavLink to={AboutRoute.to} exact>{t(AboutRoute.label)}</LangNavLink></Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container></Navbar>
    )
}

export default Footer

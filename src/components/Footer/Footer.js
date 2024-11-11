import React from 'react'
import LangNavLink from '../LangNavLink'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import VideoReleaseTrigger from '../VideoRelease/VideoReleaseTrigger'
import {
  BootstrapFullColumLayout,
  HomeRoute,
  // ReferencesRoute,
  // DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute,
  ReleaseNotesRoute,
  TermsOfUseRoute,
  ReviewPolicy,
  FaqRoute,
} from '../../constants'
import { Facebook, GitHub } from 'react-feather'
import DeGruyterLogo from '../../assets/images/Verlag_Walter_de_Gruyter_Logo_Oldenbourg.svg'
import UniluLogo from '../../assets/images/unilu-c2dh-logo.svg'
import { ReactComponent as BlueskyIcon } from '../../assets/images/bluesky.svg'
import '../../styles/components/Footer.scss'

const now = new Date()

const Footer = ({ hideOnRoutes = [] }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  if (hideOnRoutes.some((d) => pathname.indexOf(d) !== -1)) {
    console.debug(
      '[Footer] hidden following hideOnRoutes:',
      hideOnRoutes,
      'with pathname:',
      pathname,
    )
    return null
  }
  return (
    <>
      <Container className="Footer py-5">
        <Row>
          <Col {...BootstrapFullColumLayout}>
            <div className="d-md-flex justify-content-between">
              <div className="mt-2">
                ©{' '}
                <a href="https://www.uni.lu/" target="_blank" rel="noopener noreferrer">
                  University of Luxembourg
                </a>
                <br />©{' '}
                <a href="https://www.degruyter.com" target="_blank" rel="noopener noreferrer">
                  {' '}
                  De Gruyter
                </a>{' '}
                {now.getFullYear()}
                <p
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: t('contactUsingEmail') }}
                ></p>
              </div>
              <div>
                <Nav className="flex-column">
                  {[HomeRoute, AbstractSubmissionRoute, AboutRoute, ReviewPolicy].map(
                    (route, i) => (
                      <Nav.Item key={i}>
                        <LangNavLink to={route.to} exact>
                          <span>{t(route.label)}</span>
                        </LangNavLink>
                      </Nav.Item>
                    ),
                  )}
                </Nav>
              </div>
              <div>
                <Nav className="flex-column">
                  {[FaqRoute, ReleaseNotesRoute, TermsOfUseRoute].map((route, i) => (
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
            <div className="border-top pt-3 mt-3 d-md-flex justify-content-center">
              <div className="me-3 mb-3 mb-md-0 ">
                <a
                  className="plain-a"
                  href={`https://bsky.app/profile/${process.env.REACT_APP_BLUESKY}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <BlueskyIcon style={{ width: '15px' }} /> @{process.env.REACT_APP_BLUESKY}
                </a>
              </div>
              <div className="d-none d-md-block"> &middot;</div>
              <div className="mx-md-3 mb-3 mb-md-0">
                <a
                  className="plain-a"
                  href={`https://www.facebook.com/${process.env.REACT_APP_FACEBOOK}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook size={15} /> {process.env.REACT_APP_FACEBOOK}
                </a>
              </div>
              <div className="d-none d-md-block">&middot;</div>
              <div className="mx-md-3 mb-3 mb-md-0">
                <a
                  className="plain-a"
                  href={`${process.env.REACT_APP_GITHUB}/commit/${process.env.REACT_APP_GIT_COMMIT_SHA}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitHub size={15} /> {process.env.REACT_APP_GIT_TAG}
                </a>
              </div>
              <div className="d-none d-md-block">&middot;</div>
              <div className="mx-md-3 mb-3 mb-md-0">
                <span>ISSN: 2747-5271</span>
              </div>
              <div className="d-none d-md-block">&middot;</div>
              <div className="ms-md-3 mb-2 mb-md-0">
                <VideoReleaseTrigger />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapFullColumLayout}>
            <div
              className="position-relative border-top border-dark pt-3 mt-3 "
              style={{ minHeight: 200 }}
            >
              <a
                className="Footer_logoLink"
                href="https://c2dh.uni.lu"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  left: 0,
                  marginLeft: -20,
                }}
              >
                <img alt="C²DH - University of Luxembourg" src={UniluLogo} style={{ width: 300 }} />
              </a>
              <a
                className="Footer_logoLinkDeGruyter"
                href="https://www.degruyter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  left: '50%',
                }}
              >
                <img className="ml-2" alt="De Gruyter Publisher" src={DeGruyterLogo} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Footer

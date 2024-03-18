import React from 'react'
import MarkdownIt from 'markdown-it'
import { Container, Row, Col } from 'react-bootstrap'
import StaticPageLoader from './StaticPageLoader'
import { BootstrapFullColumLayout, StatusSuccess } from '../constants'
import '../styles/pages/WikiStaticPage.scss'
import PropTypes from 'prop-types'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const WikiStaticPage = ({ url = '', memoid = '', delay = 0, className = '', children }) => (
  <StaticPageLoader
    url={url}
    memoid={memoid}
    raw
    fakeData=""
    delay={delay}
    Component={({ data = '...', status }) => (
      <Container
        className={`WikiStaticPage page ${className} ${status}`}
        style={{ minHeight: '80vh' }}
      >
        <Row>
          <Col {...BootstrapFullColumLayout}>{children}</Col>
        </Row>
        <Row>
          <Col
            {...BootstrapFullColumLayout}
            dangerouslySetInnerHTML={{
              __html: status === StatusSuccess ? markdownParser.render(data) : '',
            }}
          />
        </Row>
      </Container>
    )}
  />
)

WikiStaticPage.propTypes = {
  url: PropTypes.string.isRequired,
  memoid: PropTypes.string,
  delay: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default WikiStaticPage

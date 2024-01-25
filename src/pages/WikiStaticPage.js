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

const WikiStaticPage = ({ url = '', className = '', children }) => (
  <StaticPageLoader
    url={url}
    raw
    fakeData=""
    delay={0}
    Component={({ data = '...', status }) => (
      <Container className={`WikiStaticPage page ${className}`} style={{ minHeight: '100vh' }}>
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
  className: PropTypes.string,
  children: PropTypes.node,
}

export default WikiStaticPage

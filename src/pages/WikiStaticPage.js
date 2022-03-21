import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import StaticPageLoader from './StaticPageLoader'
import { BootstrapFullColumLayout, StatusSuccess } from '../constants'
import MarkdownIt from 'markdown-it'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

const WikiStaticPage = ({ url='', children }) => (
  <StaticPageLoader
    url={url}
    raw
    fakeData=''
    delay={0}
    Component={({ data='', status }) => (
      <Container className="WikiStaticPage page" style={{ minHeight:'100vh' }}>
        <Row>
          <Col {...BootstrapFullColumLayout}>
            {children}
          </Col>
        </Row>
        <Row>
          <Col {...BootstrapFullColumLayout} dangerouslySetInnerHTML={{
            __html: status === StatusSuccess ? markdownParser.render(data) : ''
          }} />
        </Row>
      </Container>
    )}
  />
)

export default WikiStaticPage

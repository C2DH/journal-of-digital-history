import React, { useEffect } from 'react'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { Container, Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import StaticPageLoader from './StaticPageLoader'
import { BootstrapFullColumLayout, StatusSuccess } from '../constants/globalConstants'
import '../styles/pages/WikiStaticPage.scss'
import PropTypes from 'prop-types'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
}).use(markdownItAnchor)

const scrollToHashTarget = (hash) => {
  // Resolve current URL hash into a stable anchor id.
  const anchorId = decodeURIComponent(hash.replace('#', ''))
  if (!anchorId) return false

  const cssEscape = window.CSS?.escape
  const escapedAnchorId = cssEscape
    ? cssEscape(anchorId)
    : anchorId.replace(/["\\]/g, '\\$&')

  const target = document.getElementById(anchorId) || document.querySelector(`#${escapedAnchorId}`)
  if (!target) return false

  // Use native scrolling so CSS `scroll-margin-top` can offset fixed headers.
  target.scrollIntoView({ block: 'start' })
  return true
}

const WikiStaticPageContent = ({ data = '...', status, className = '', children }) => {
  const { hash } = useLocation()

  useEffect(() => {
    if (status !== StatusSuccess || !hash) return

    let retryFrame = null
    // Wait one frame for markdown HTML to be committed, then jump to the hash target.
    const frame = requestAnimationFrame(() => {
      if (!scrollToHashTarget(hash)) {
        // Retry once on the next frame to avoid occasional race conditions on first load.
        retryFrame = requestAnimationFrame(() => {
          scrollToHashTarget(hash)
        })
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      if (retryFrame) {
        cancelAnimationFrame(retryFrame)
      }
    }
  }, [status, hash, data])

  return (
    <Container className={`WikiStaticPage page ${className} ${status}`} style={{ minHeight: '80vh' }}>
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
  )
}

const WikiStaticPage = ({ url = '', memoid = '', delay = 0, className = '', children }) => (
  <StaticPageLoader
    url={url}
    memoid={memoid}
    raw
    fakeData=""
    delay={delay}
    Component={({ data = '...', status }) => (
      <WikiStaticPageContent data={data} status={status} className={className}>
        {children}
      </WikiStaticPageContent>
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

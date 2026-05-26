import DOMPurify from 'dompurify'
import parse from 'html-react-parser'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItShortcodeTag from 'markdown-it-shortcode-tag'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

import StaticPageLoader from './StaticPageLoader'
import { BootstrapFullColumLayout, StatusSuccess } from '../constants/globalConstants'

import '../styles/pages/WikiStaticPage.scss'

// Escape regex metacharacters in user-provided shortcode names.
const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Convert shortcode names to parser-friendly tag names.
const normalizeShortcodeName = (name = '') => name.toLowerCase().replace(/[^a-z0-9_]/g, '')

const buildShortcodeSetup = (shortcodes = []) => {
  const shortcodeTags = {}
  const normalizePatterns = []
  const shortcodeComponents = {}

  shortcodes.forEach(({ name, component }) => {
    if (!name || !component) return

    const normalizedName = normalizeShortcodeName(name)
    if (!normalizedName) return

    const containerId = `shortcode-${normalizedName}-container`

    // Keep author-friendly tags in markdown, then normalize them before shortcode parsing.
    normalizePatterns.push({
      pattern: new RegExp(`<${escapeRegExp(name)}(\\s*)>`, 'g'),
      normalizedName,
    })

    shortcodeTags[normalizedName] = {
      render: () => `<div id="${containerId}"></div>`,
      inline: true,
    }

    shortcodeComponents[containerId] = component
  })

  return { shortcodeTags, normalizePatterns, shortcodeComponents }
}

// Apply all shortcode tag normalizations to raw markdown.
const normalizeShortcodes = (content = '', normalizePatterns = []) =>
  normalizePatterns.reduce(
    (result, { pattern, normalizedName }) => result.replace(pattern, `<${normalizedName}$1>`),
    content,
  )

const renderMarkdownWithShortcodes = (content = '', shortcodes = []) => {
  const { shortcodeTags, normalizePatterns, shortcodeComponents } = buildShortcodeSetup(shortcodes)

  const markdownParser = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAnchor)
    .use(markdownItShortcodeTag, shortcodeTags)

  const renderShortcodes = {
    replace: (node) => {
      // Swap placeholder containers emitted by markdown-it with the mapped React component.
      const component = shortcodeComponents[node?.attribs?.id]
      if (!component) return undefined

      return React.isValidElement(component) ? component : React.createElement(component)
    },
  }

  return parse(
    DOMPurify.sanitize(markdownParser.render(normalizeShortcodes(content, normalizePatterns))),
    renderShortcodes,
  )
}

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

const WikiStaticPageContent = ({
  data = '...',
  status,
  className = '',
  shortcodes = [],
  children
}) => {
  
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

  const renderedContent = useMemo(
    () => (status === StatusSuccess ? renderMarkdownWithShortcodes(data, shortcodes) : null),
    [status, data, shortcodes],
  )

  return (
    <Container className={`WikiStaticPage page ${className} ${status}`} style={{ minHeight: '80vh' }}>
      <Row>
        <Col {...BootstrapFullColumLayout}>{children}</Col>
      </Row>
      <Row>
        <Col
          {...BootstrapFullColumLayout}
        >
          {renderedContent}
        </Col>
      </Row>
    </Container>
  )
}

const WikiStaticPage = ({
  url = '',
  memoid = '',
  delay = 0,
  className = '',
  shortcodes = [],
  children
}) => (
  <StaticPageLoader
    url={url}
    memoid={memoid}
    raw
    fakeData=""
    delay={delay}
    Component={({ data = '...', status }) => (
      <WikiStaticPageContent
        data={data}
        status={status}
        className={className}
        shortcodes={shortcodes}
      >
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
  shortcodes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]).isRequired,
    })
  ),
  children: PropTypes.node,
}

export default WikiStaticPage

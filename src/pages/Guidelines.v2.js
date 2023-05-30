import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import StaticPageLoader from './StaticPageLoader'
import { BootstrapFullColumLayout } from '../constants'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router-dom'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const GuidelineSection = ({ section = '' }) => {
  // take the title from the first line
  const parts = section.split('\n\n')
  // render the title
  const title = markdownParser.render(parts[0] + '\n\n')
  return (
    <section>
      <div dangerouslySetInnerHTML={{ __html: title }} />
      {title}
      <pre>{JSON.stringify(parts, null, 2)}</pre>
    </section>
  )
}

const GuidelinesShuffler = ({ data = '' }) => {
  const { notebook } = useParams()
  if (!data) return null

  let sections = data.split(/##\s/g)
  // parse html
  const html = markdownParser.render(sections.shift()).replace(/<h1[^>]*>/g, '<h1 class="my-5">')

  // get available notebookIds from ipynb filenames, one per href inside data
  // data contains markdown links
  const availableNotebookIds = (data.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).map((href) =>
    JSON.stringify(href),
  )
  // const availableNotebookIds = data
  //   .match(/href="([^"]*)"/g)
  //   ?.map((href) => href.replace(/href="([^"]*)"/, '$1'))
  //   // eslint-disable-next-line no-debugger
  //   debugger

  return (
    <Container className="Guidelines page">
      <Row>
        <Col {...BootstrapFullColumLayout} dangerouslySetInnerHTML={{ __html: html }} />
        <pre>
          {JSON.stringify(notebook, null, 2)}
          {JSON.stringify(sections, null, 2)}
          {JSON.stringify(availableNotebookIds, null, 2)}
        </pre>
      </Row>

      {sections.map((section, index) => (
        <Row key={index}>
          <Col {...BootstrapFullColumLayout}>
            <GuidelineSection section={`## ${section.trim()}`} />
          </Col>
        </Row>
      ))}
    </Container>
  )
}

const Guidelines = () => {
  console.debug(
    '[Guidelines] process.env.REACT_APP_WIKI_GUIDELINES:',
    process.env.REACT_APP_WIKI_GUIDELINES,
  )
  return (
    <StaticPageLoader
      raw
      url={process.env.REACT_APP_WIKI_GUIDELINES}
      Component={GuidelinesShuffler}
      fakeData={'# Guidelines for authors'}
    />
  )
}

export default Guidelines

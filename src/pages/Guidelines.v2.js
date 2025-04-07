import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import StaticPageLoader from './StaticPageLoader'
import { BootstrapFullColumLayout } from '../constants/globalConstants'
import MarkdownIt from 'markdown-it'
import { useParams } from 'react-router-dom'
import LangLink from '../components/LangLink'
import { Book, BookOpen } from 'react-feather'
import GuidelinesNotebookViewer from '../components/GuidelinesNotebookViewer'
import { useCurrentWindowDimensions } from '../hooks/graphics'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

// const GuidelineSection = ({ section = '' }) => {
//   // take the title from the first line
//   const parts = section.split('\n\n')
//   // render the title
//   const title = markdownParser.render(parts[0] + '\n\n')
//   return (
//     <section>
//       <div dangerouslySetInnerHTML={{ __html: title }} />
//       <div dangerouslySetInnerHTML={{ __html: markdownParser.render(parts[1] || '') }} />
//     </section>
//   )
// }

const GuidelinesShuffler = ({ data = '', isFake }) => {
  const { width, height } = useCurrentWindowDimensions()
  const { notebook: notebookId = 'introduction' } = useParams()
  const safeNotebookId = notebookId.replace(/[^A-Za-z_-]/g, '')

  let sections = (data || '').split(/##\s/g)
  // parse html
  const html = markdownParser.render(sections.shift()).replace(/<h1[^>]*>/g, '<h1 class="my-5">')

  // get available notebookIds from ipynb filenames, one per href inside data
  // data contains markdown links
  const links = data.match(/\[([^\]]+)\]\(([^)]+)\)/g)

  const availableNotebooks =
    links === null
      ? []
      : links
          .filter((l) => l.indexOf('.ipynb') !== -1)
          .map((link) => {
            const label = link.match(/\[([^\]]+)\]/).pop()
            const key = link.match(/([A-Za-z_-]+)\.ipynb/).pop()
            return { key, label, url: link.match(/\(([^)]+)\)/).pop() }
          })
  const availableNotebookIds = availableNotebooks.map((n) => n.key)
  const notebook = availableNotebooks.find((n) => n.key === safeNotebookId) || availableNotebooks[0]
  const notebookUrl = notebook?.url

  const memoid = [
    safeNotebookId.length > 0 ? safeNotebookId : 'guidelines',
    isFake ? 'fake' : '',
  ].join('-')
  console.info(
    '[Guidelines] \n - safeNotebookId:',
    safeNotebookId,
    '\n - availableNotebookIds:',
    availableNotebookIds,
    '\n - notebookUrl:',
    notebookUrl,
    '\n - memoid:',
    memoid,
  )

  return (
    <GuidelinesNotebookViewer
      memoid={memoid}
      notebookUrl={notebookUrl}
      plainTitle={notebook?.label}
      width={width}
      height={height}
    >
      <Container className="Guidelines page">
        <Row>
          <Col {...BootstrapFullColumLayout} dangerouslySetInnerHTML={{ __html: html }} />
        </Row>
        <Row className="mb-5 ">
          <Col {...BootstrapFullColumLayout}>
            {availableNotebooks.map((n, index) => (
              <LangLink
                className={`btn mx-1 btn-sm rounded ${
                  safeNotebookId === n.key ? 'btn-secondary' : 'btn-outline-secondary'
                }`}
                to={`guidelines/${n.key}`}
                key={index}
              >
                {n.label} {safeNotebookId !== n.key ? <Book size={16} /> : <BookOpen size={16} />}
              </LangLink>
            ))}
          </Col>
        </Row>
        {/* <Row className="p-1 pt-3 border-top border-secondary">
          {sections.map((section, index) => (
            <Col key={index} className="mb-5" md={{ span: 4, offset: index % 2 }}>
              <GuidelineSection section={`## ${section.trim()}`} />
            </Col>
          ))}{' '}
        </Row> */}
      </Container>
    </GuidelinesNotebookViewer>
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

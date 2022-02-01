import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'
import { useGetRawContents } from '../logic/api/fetchData'
import MarkdownIt from 'markdown-it'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

function chunkReducer(acc, d, i) {
  // https://stackoverflow.com/questions/8495687/split-array-into-chunks
  // viewed on 2022/01/11
  const ch = Math.floor(i/2);
  acc[ch] = [].concat((acc[ch]||[]), d)
  return acc
}

const Faq = () => {
  console.debug('[Faq] REACT_APP_GITHUB_WIKI_FAQ', process.env.REACT_APP_GITHUB_WIKI_FAQ)

  const { data, error } = useGetRawContents({
    url: process.env.REACT_APP_GITHUB_WIKI_FAQ,
  })
  // get sections, delimited by H2
  const sections = (data || '')
    .split(/\n(## [^\n]*)\n/g)
    .slice(1)
    .reduce(chunkReducer, [])
    .map(([title, content]) => {
      // question+/answer pairs
      const qa = (content || '').split(/\n(### [^\n]*)\n/g)
      const introduction = qa.shift().trim()

      return {
        title,
        introduction,
        paragraphs: qa.reduce(chunkReducer, [])
      }
    })
  console.debug('[Faq] useGetRawContents', error, sections)

  return (
    <Container className="Faq page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Faq</h1>
        </Col>
      </Row>
      {sections.map((section, i) => (
        <Row key={i} className="mb-3">
          <Col {...BootstrapColumLayout}>

            <div dangerouslySetInnerHTML={{
              __html: markdownParser.render(section.title)
            }} />
            <blockquote dangerouslySetInnerHTML={{
              __html: markdownParser.render(section.introduction)
            }} />

            {section.paragraphs.map((p,j) => (
              <React.Fragment key={j}>
                <p dangerouslySetInnerHTML={{
                  __html: markdownParser.render(p[0])
                }} />
                <p key={j} dangerouslySetInnerHTML={{
                  __html: markdownParser.render(p[1])
                }} />
              </React.Fragment>
            ))}
          </Col>
        </Row>
      ))}
    </Container>
  )
}

export default Faq

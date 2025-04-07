import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapFullColumLayout, StatusSuccess } from '../constants/globalConstants'
import StaticPageLoader from './StaticPageLoader'
import MarkdownIt from 'markdown-it'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

function chunkReducer(acc, d, i) {
  // https://stackoverflow.com/questions/8495687/split-array-into-chunks
  // viewed on 2022/01/11
  const ch = Math.floor(i / 2)
  acc[ch] = [].concat(acc[ch] || [], d)
  return acc
}

const Faq = () => {
  const { t } = useTranslation()
  return (
    <StaticPageLoader
      url={process.env.REACT_APP_GITHUB_WIKI_FAQ}
      raw
      fakeData=""
      delay={0}
      Component={({ data = '', status }) => {
        // get sections, delimited by H2
        let sections = []
        if (status == StatusSuccess) {
          sections = data
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
                paragraphs: qa.reduce(chunkReducer, []),
              }
            })
        }
        console.debug('[Faq] useGetRawContents', sections)

        return (
          <Container className="Faq page" style={{ minHeight: '100vh' }}>
            <Row>
              <Col {...BootstrapFullColumLayout}>
                <h1 className="my-5">{t('pages.faq.title')}</h1>
              </Col>
            </Row>
            {sections.map((section, i) => (
              <Row key={i} className="mb-3">
                <Col {...BootstrapFullColumLayout}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: markdownParser.render(section.title),
                    }}
                  />
                  <blockquote
                    dangerouslySetInnerHTML={{
                      __html: markdownParser.render(section.introduction),
                    }}
                  />

                  {section.paragraphs.map((p, j) => (
                    <React.Fragment key={j}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: markdownParser.render(p[0]),
                        }}
                      />
                      <p
                        key={j}
                        dangerouslySetInnerHTML={{
                          __html: markdownParser.render(p[1]),
                        }}
                      />
                    </React.Fragment>
                  ))}
                </Col>
              </Row>
            ))}
          </Container>
        )
      }}
    />
  )
}

export default Faq

import MarkdownIt from 'markdown-it'
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapFullColumLayout, StatusSuccess } from '../constants/globalConstants'
import { useTranslation } from 'react-i18next'
import StaticPageLoader from './StaticPageLoader'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const ReleaseNotes = () => {
  const { t } = useTranslation()
  return (
    <StaticPageLoader
      url={process.env.REACT_APP_GITHUB_RELEASES_API_ENDPOINT}
      fakeData={[
        {
          name: 'Almost Serenity',
          published_at: new Date(),
          body: '...',
          html_url: '',
          tag_name: 'v0.0.0',
        },
        {
          name: '*',
          published_at: new Date(),
          body: '...',
          html_url: '',
          tag_name: 'v0.0.0',
        },
      ]}
      delay={100}
      Component={({ data: releases, status }) => (
        <Container className="ReleaseNotes page" style={{ minHeight: '100vh' }}>
          <Row>
            <Col {...BootstrapFullColumLayout}>
              <h1 className="my-5">{t('pages.releaseNotes.title')}</h1>
              <p className="mb-5">
                {t('pages.releaseNotes.subheading', {
                  n: status === StatusSuccess ? releases.length : '*',
                })}
              </p>
            </Col>
          </Row>
          {releases.map((release, i) => (
            <Row key={i}>
              <Col {...BootstrapFullColumLayout}>
                <h2>{release.name}</h2>
                <a href={release.html_url} target="_blank" rel="noreferrer">
                  {release.tag_name}
                </a>
                <p>
                  {t('dates.LLLL', { date: new Date(release.published_at) })}
                  &nbsp;&mdash;&nbsp;
                  {t('dates.fromNow', { date: new Date(release.published_at) })}
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: markdownParser.render(release.body),
                  }}
                />
              </Col>
            </Row>
          ))}
        </Container>
      )}
    />
  )
}

export default ReleaseNotes

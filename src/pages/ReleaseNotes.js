import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout, StatusFetching } from '../constants'
import { useGetJSON } from '../logic/api/fetchData'
import { useTranslation } from 'react-i18next'

const FakeReleases = [
  {
    name: '*',
    published_at: new Date(),
    body: '',
    html_url: '',
    tag_name:'v0.0.0'
  },
  {
    name: '*',
    published_at: new Date(),
    body: '',
    html_url: '',
    tag_name:'v0.0.0'
  }
]
/**
 * ReleaseNotes page.
 * @component
 * @example
 * return (
 *   <ReleaseNotes />
 * )
 */
const ReleaseNotes = () => {
  const { t } = useTranslation()
  // load release notes from github
  const { data:releases, status } = useGetJSON({
    url: process.env.REACT_APP_GITHUB_RELEASES_API_ENDPOINT,
    delay: 100,
  })

  return (
    <>
    <Container className="ReleaseNotes page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Release notes</h1>
          <p className="mb-5">{Array.isArray(releases) ? releases.length : '...'} releases so far.</p>
        </Col>
      </Row>
      {(Array.isArray(releases) ? releases : FakeReleases).map((release, i) => (
        <Row key={i}>
          <Col {...BootstrapColumLayout}>
          <h2>{release.name}</h2>
          <a href={release.html_url} target="_blank" rel="noreferrer" >{release.tag_name}</a>
          <p>
            {t('dates.LLLL', { date: new Date(release.published_at)})}
            &nbsp;&mdash;&nbsp;
            {t('dates.fromNow', { date: new Date(release.published_at)})}
          </p>
          <p>{release.body}</p>
          </Col>
        </Row>
      ))}
      {status === StatusFetching && (
        <Row>
          <Col {...BootstrapColumLayout}>

          </Col>
          loading
        </Row>
      )}
    </Container>
    {/*
      <pre>
        {JSON.stringify(releases, null, 2)}
        {status} === {StatusSuccess}
      </pre>
    */}
    </>
  )
}

export default ReleaseNotes

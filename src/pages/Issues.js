import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import ErrorViewer from './ErrorViewer'
import Loading from './Loading'
import IssueListItem  from '../components/Issue/IssueListItem'
import { StatusSuccess } from '../constants'

const FakeIssues = [
  { name: '...', description: '&nbsp;' },
  { name: '...', description: '&nbsp;' },
]

const Issues = () => {
  const { t } = useTranslation()
  const { data:issues, error, status, errorCode } = useGetJSON({
    url: `/api/issues?ordering=-creation_date`,
    delay: 150
  })
  console.info('Issues status', status, 'error', error)
  if (error) {
    return (
      <ErrorViewer error={error} errorCode={errorCode} />
    )
  } else if (status !== StatusSuccess ) {
    // return fake contents
    return (
      <>
      <Loading title={t('pages.issues.title')}>
        <h3>{t('pages.issues.subheading')}</h3>
        <p>{t('pages.issues.introduction')}</p>
      </Loading>
      <Container>
        <Row>
          {FakeIssues.map((issue, i) => (
            <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
              <IssueListItem issue={issue} isFake/>
            </Col>
          ))}
        </Row>
      </Container>
      </>
    )
  }
  return (
    <Container className="Issues page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{t('pages.issues.title')}</h1>
          <h3>{t('pages.issues.subheading')}</h3>
          <p>{t('pages.issues.introduction')}</p>
        </Col>
      </Row>
      <Row>
        {issues ? issues.map((issue, i) => (
          <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <IssueListItem issue={issue} />
          </Col>
        )): null}
      </Row>
      <Row>

      </Row>
    </Container>
  )
}

export default Issues

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import ErrorViewer from './ErrorViewer'
import IssueListItem  from '../components/Issue/IssueListItem'


const Issues = ({ match: { params: { issueId }}}) => {
  const { t } = useTranslation()
  const { data:issues, error, status, errorCode } = useGetJSON({
    url: `/api/issues?ordering=-creation_date`,
    delay: 0,
    timeout: process.env.REACT_APP_API_TIMEOUT || 0
  })
  console.info('Issues status', status, 'error', error)

  if (error) {
    return (
      <ErrorViewer error={error} errorCode={errorCode} />
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

      <Row className="mt-5">
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

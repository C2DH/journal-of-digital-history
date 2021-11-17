import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import IssueArticlesGrid from '../components/Issue/IssueArticlesGrid'
import ErrorViewer from './ErrorViewer'
import Loading from './Loading'
import { StatusSuccess } from '../constants'


const Issue = ({ match: { params: { id:issueId }}}) => {
  const { t } = useTranslation()
  const { data:issue, error, status, errorCode } = useGetJSON({
    url: `/api/issues/${issueId}`,
    delay: 0
  })
  if (error) {
    return (
      <ErrorViewer error={error} errorCode={errorCode} />
    )
  } else if (status !== StatusSuccess ) {
    return (
      <Loading title={`${t('pages.issues.title')}/${issueId}`}>
        <h1 className="my-5"></h1>
      </Loading>
    )
  }

  return (
    <Container className="Issue page mt-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          {issue?.pid} &middot; <b>{new Date(issue.publication_date).getFullYear()}</b>
          <h1 >{issue?.name}</h1>
          {issue?.description ? (
            <h3><span className="text-muted">{issue?.pid}</span>&nbsp;{issue?.description}</h3>
          ):null}
        </Col>
      </Row>
    { issue ? <IssueArticlesGrid issue={issue}/> : null }
    </Container>
  )
}
export default Issue

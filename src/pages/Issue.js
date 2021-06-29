import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import IssueArticlesGrid from '../components/Issue/IssueArticlesGrid'

const Issue = ({ match: { params: { id:issueId }}}) => {
  console.log("********issueid*******" + issueId)
  const { t } = useTranslation()
  const { data:issue, error:issueError, status:issueStatus } = useGetJSON({ url: `/api/issues/${issueId}`, delay: 1000 })
  const { data:articles, error:articlesError, status: articlesStatus } = useGetJSON({ url: `/api/articles/?pid=${issueId}`, delay: 2000 })
  console.info("Issue data:", issue, "status:", issueStatus, "error:", issueError)
  return (
    <>
    <Container className="Issue page mt-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1>{issue?.name}</h1>
          <h2>{issue?.description}</h2>
        </Col>
      </Row>
    </Container>
    {articles ? <IssueArticlesGrid articles={articles}/> : null}
    {articlesError ? <pre>{JSON.stringify(articlesError, null, 2)}</pre>: null}
    </>
  )
}
export default Issue

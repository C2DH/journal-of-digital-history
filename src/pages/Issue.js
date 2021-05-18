import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import IssueArticlesGrid from '../components/Issue/IssueArticlesGrid'

const Issue = ({ match: { params: { issueId }}}) => {
  const { t } = useTranslation()
  const { data, error, status } = useGetJSON({ url: `/mock-api/articles.json`, delay: 2000 })
  return (
    <>
    <Container className="Issue page mt-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1>{t('pages.issue.title')}</h1>
          <h2>{status}</h2>
        </Col>
      </Row>
    </Container>
    {data ? <IssueArticlesGrid articles={data}/> : null}
    {error ? <pre>{JSON.stringify(error, null, 2)}</pre>: null}
    </>
  )
}

export default Issue

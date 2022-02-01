import React from 'react'
import groupBy from 'lodash/groupBy'
import StaticPageLoader from './StaticPageLoader'
import { Container, Row, Col } from 'react-bootstrap'
import IssueArticles from '../components/Issue/IssueArticles'
import Issue from '../components/Issue'
import { BootstrapColumLayout } from '../constants'

const ArticlesGrid = ({ data }) => {
  const articlesByIssue = groupBy(data, 'issue.pid')
  const issues = Object.keys(articlesByIssue).sort((a,b) => {
    return articlesByIssue[a][0].issue.pid < articlesByIssue[b][0].issue.pid
  })

  return (
    <Container className="Issue page mt-5">
      {issues.map((issueId) => {
        const issue = articlesByIssue[issueId][0].issue
        return (
          <React.Fragment key={issueId}>
            <Row>
              <Col {...BootstrapColumLayout}>
                <Issue item={issue} />
              </Col>
            </Row>
            <IssueArticles  data={articlesByIssue[issueId]}/>
          </React.Fragment>
        )
      })}
    </Container>
  )
}

const Articles = () => {
  return (
    <StaticPageLoader
      url="/api/articles?limit=100"
      Component={ArticlesGrid}
    />
  )
}

export default Articles

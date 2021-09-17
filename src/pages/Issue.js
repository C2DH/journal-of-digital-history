import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import IssueArticleGridItem from '../components/Issue/IssueArticleGridItem'
import ErrorViewer from './ErrorViewer'
import Loading from './Loading'
import { StatusSuccess } from '../constants'

const IssueArticlesGrid = ({ issue, onError }) => {
  // console.info('IssueArticlesGrid', articles)
  const { data:articles, error, status, errorCode } = useGetJSON({
    url: `/api/articles/?pid=${issue.pid}`
  })
  if (typeof onError === 'function' && error) {
    console.error('IssueArticlesGrid loading error:', errorCode, error)
  }
  if (status !== StatusSuccess ) {
    return null
  }
  return (
    <Row>
        {articles.map((article, i) => (
          <Col key={i} lg={{ span: 4, offset:0}} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <IssueArticleGridItem article={article} num={i+1}/>
          </Col>
        ))}
    </Row>
  )
}

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
    <Container className="Issue page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{issue?.name}</h1>
          <h3><span className="text-muted">{issue?.pid}</span>&nbsp;{issue?.description}</h3>
          <p>{t('dates.month', { date: new Date(issue.creation_date)})}</p>
        </Col>
      </Row>
    { issue ? <IssueArticlesGrid issue={issue}/> : null }
    </Container>
  )
}
export default Issue

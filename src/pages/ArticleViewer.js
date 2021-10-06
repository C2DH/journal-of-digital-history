import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout, StatusSuccess, StatusFetching, StatusIdle } from '../constants'
import Loading from '../components/Loading'
import ErrorViewer from './ErrorViewer'
import NotebookViewer from './NotebookViewer'
import { extractMetadataFromArticle } from '../logic/api/metadata'
import { useIssueStore } from '../store'


const ArticleViewer = ({ match: { params: { pid }}}) => {
  const { t } = useTranslation()
  const setIssue = useIssueStore(state => state.setIssue)
  const { data:article, error, status, errorCode} = useGetJSON({
    url:`/api/articles/${pid}`,
    delay: 1000
  })

  useEffect(() => {
    if (article && article.issue) {
      setIssue(article.issue)
    } else {
      setIssue({pid: '...'})
    }
    return () => {
      // clear
      setIssue(null)
    }
  }, [article])

  if (error) {
    return <ErrorViewer error={error} errorCode={errorCode} />
  }
  if (status !== StatusSuccess) {
    return (
      <Container className="mt-5 page">
        <Row>
          <Col {...BootstrapColumLayout}>
          {(status === StatusFetching || status === StatusIdle) && (
            <>
            <h1 className="my-5">{t('pages.loading.title')}</h1>
            <Loading />
            </>
          )}
          </Col>
        </Row>
      </Container>
    )
  }
  // status is success, metadata is ready.
  const {title, abstract, keywords, contributor, collaborators} = extractMetadataFromArticle(article)
  console.info('ArticleViewer rendered, title:', title, 'contributors:', contributor, 'collaborators:', collaborators, 'keywords', keywords)
  return (
    <NotebookViewer
      title={title}
      abstract={abstract}
      contributor={contributor}
      collaborators={collaborators}
      keywords={keywords}
      status={article.status}
      publicationDate={article.publication_date}
      binderUrl={article.binder_url}
      emailAddress={article.abstract?.contact_email}
      match={{
      params: {
        encodedUrl: article.notebook_url
      }
    }}/>
  )
}

export default ArticleViewer

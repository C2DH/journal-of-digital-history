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
import { setBodyNoScroll } from '../logic/viewport'

const ArticleViewer = ({ match: { params: { pid }}}) => {
  const { t } = useTranslation()
  const setIssue = useIssueStore(state => state.setIssue)
  const { data:article, error, status, errorCode} = useGetJSON({
    url:`/api/articles/${pid}`,
    delay: 1000
  })

  useEffect(() => {
    setBodyNoScroll(true)
    return function() {
      setBodyNoScroll(false)
    }
  },[])

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
      <Container className="page">
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
  const {
    title, plainTitle, abstract, excerpt,
    keywords, contributor,
    plainContributor, collaborators
  } = extractMetadataFromArticle(article)
  console.info(
    '%cArticleViewer', 'font-weight: bold','rendered with metadata\n- title:', title, plainTitle,
    '\n- excerpt:', excerpt, '\n- contributors:', plainContributor,
    '\n- collaborators:', collaborators, '\n- keywords', keywords
  )
  return (
    <NotebookViewer
      pid={pid}
      title={title}
      plainTitle={plainTitle}
      plainContributor={plainContributor}
      excerpt={excerpt}
      abstract={abstract}
      contributor={contributor}
      collaborators={collaborators}
      keywords={keywords}
      publicationStatus={article.status}
      publicationDate={article.publication_date}
      binderUrl={article.binder_url}
      emailAddress={article.abstract?.contact_email}
      doi={article.doi}
      issue={article.issue}
      bibjson={article.citation}
      isJavascriptTrusted
      match={{
      params: {
        encodedUrl: article.notebook_url
      }
    }}/>
  )
}

export default ArticleViewer

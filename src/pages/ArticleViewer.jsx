import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router'

import { useGetJSON } from '../logic/api/fetchData'
import {
  BootstrapColumLayout,
  StatusSuccess,
  StatusFetching,
  StatusIdle,
  StatusError,
} from '../constants/globalConstants'
import Loading from '../components/Loading'
import ErrorViewer from './ErrorViewer'
import NotebookViewer from './NotebookViewer'
import { extractMetadataFromArticle } from '../logic/api/metadata'
import { useIssueStore } from '../store'
import { setBodyNoScroll } from '../logic/viewport'


const ArticleViewer = () => {
  const { pid } = useParams()
  const { t } = useTranslation()
  const setIssue = useIssueStore((state) => state.setIssue)
  const {
    data: article,
    error,
    status,
    errorCode,
  } = useGetJSON({
    url: `/api/articles/${pid}`,
    delay: 0,
  })

  useEffect(() => {
    setBodyNoScroll(true)
    return function () {
      setBodyNoScroll(false)
    }
  }, [])

  useEffect(() => {
    if (status === StatusError) {
      setBodyNoScroll(false)
    }
  }, [status])

  useEffect(() => {
    if (article && article.issue) {
      setIssue(article.issue)
    } else {
      setIssue({ pid: '...' })
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
    title,
    plainTitle,
    abstract,
    excerpt,
    keywords,
    contributor,
    plainContributor,
    collaborators,
  } = extractMetadataFromArticle(article)
  console.info(
    '%cArticleViewer',
    'font-weight: bold',
    'rendered with metadata\n- title:',
    title,
    plainTitle,
    '\n - excerpt:',
    excerpt,
    '\n - contributors:',
    plainContributor,
    '\n - collaborators:',
    collaborators,
    '\n - keywords',
    keywords,
    '\n - repository_url:',
    article.repository_url,
    '\n - binder_url:',
    article.binder_url,
    '\n - dataverse_url:',
    article.dataverse_url,
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
      publicationDate={new Date(article.issue?.publication_date)}
      binderUrl={article.binder_url}
      repositoryUrl={article.repository_url}
      dataverseUrl={article.dataverse_url}
      emailAddress={article.abstract?.contact_email}
      doi={article.doi}
      issue={article.issue}
      bibjson={article.citation}
      parserVersion={parseInt(article.data.parserVersion) || 2}
      isJavascriptTrusted
      encodedUrl={article.notebook_url} 
    />
  )
}

export default ArticleViewer

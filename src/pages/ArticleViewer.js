import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout, StatusSuccess, StatusFetching, StatusIdle } from '../constants'
import Loading from '../components/Loading'
import NotebookViewer from './NotebookViewer'
import NotFound from './NotFound'
import { markdownParser } from '../logic/ipynb'


function extractMetadataFromArticle(article, parser){
  const result = {
    title: null,
    abstract: null,
    contributors: [], keywords: []
  }

  if (typeof article?.data === 'undefined') {
    return result
  }
  if (Array.isArray(article.data.title)) {
    result.title = parser.render(article.data.title.join(''))
  }
  if (Array.isArray(article.data.abstract)) {
    result.abstract = parser.render(article.data.abstract.join(''))
  }
  if (Array.isArray(article.data.contributor)) {
    result.contributors = article.data.contributor.filter(d => typeof d === 'string').map(d => parser.render(d))
  }
  if (Array.isArray(article.data.keywords)) {
    result.keywords = article.data.keywords.reduce((acc, d) => {
      return acc.concat(String(d).trim().split(/\s*,\s*/))
    }, []).filter(d => d.length)
  }
  return result
}

const ArticleViewer = ({ match: { params: { pid }}}) => {
  const { t } = useTranslation()
  const { data:article, error, status, errorCode} = useGetJSON({
    url:`/api/articles/${pid}`,
    delay: 1000
  })
  if (error) {
    if (errorCode===404) {
      return <NotFound/>
    }
    console.error(error)
    return <div>Error <pre>{JSON.stringify({errorCode, article}, null, 2)}</pre></div>
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
  const {title, abstract, keywords, contributors} = extractMetadataFromArticle(article, markdownParser)
  console.info('ArticleViewer rendered, title:', title)
  console.info('ArticleViewer rendered, contributors:', contributors)
  return (
    <NotebookViewer
      title={title}
      abstract={abstract}
      contributors={contributors}
      keywords={keywords}
      status={article.status}
      publicationDate={article.publication_date}
      match={{
      params: {
        encodedUrl: article.notebook_url
      }
    }}/>
  )
}

export default ArticleViewer

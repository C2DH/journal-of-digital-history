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
  let title = null
  let abstract = null
  let contributor = null

  if (typeof article?.data === 'undefined') {
    return [title, abstract, contributor]
  }
  if (Array.isArray(article.data.title)) {
    title = parser.render(article.data.title.join(''))
  }
  if (Array.isArray(article.data.abstract)) {
    abstract = parser.render(article.data.abstract.join(''))
  }
  if (Array.isArray(article.data.contributor)) {
    contributor = parser.render(article.data.contributor.join(''))
  }
  return [title, abstract, contributor]
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
  const [title, abstract, contributor] = extractMetadataFromArticle(article, markdownParser)
  console.info('ArticleViewer rendered, title:', title)
  console.info('ArticleViewer rendered, contributor:', contributor)
  return (
    <NotebookViewer title={title} abstract={abstract} contributor={contributor} match={{
      params: {
        encodedUrl: article.notebook_url
      }
    }}/>
  )
}

export default ArticleViewer

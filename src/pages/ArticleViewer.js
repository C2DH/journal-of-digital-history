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

  article.data.cells.forEach((d) => {
    if (Array.isArray(d.title)) {
      title = parser.render(d.title.join(''))
    }
    if (Array.isArray(d.abstract)) {
      abstract = parser.render(d.abstract.join(''))
    }
  })
  return [title, abstract]
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
  const [title, abstract] = extractMetadataFromArticle(article, markdownParser)
  console.info('ArticleViewer rendered, title:', title)
  return (
    <NotebookViewer title={title} abstract={abstract} match={{
      params: {
        encodedUrl: article.notebook_url
      }
    }}/>
  )
}

export default ArticleViewer

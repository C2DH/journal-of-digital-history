import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { decodeNotebookURL } from '../logic/ipynb'
import { BootstrapColumLayout, StatusSuccess, StatusFetching, StatusIdle } from '../constants'
import Article from './Article'
import Loading from '../components/Loading'
import { useQueryParam, StringParam } from 'use-query-params'
import { DisplayLayerHermeneutics } from '../constants'


const NotebookViewer = ({ match: { params: { encodedUrl }}}) => {
  const { t } = useTranslation()
  const [layer, setLayer] = useQueryParam('layer', StringParam)

  const url = useMemo(() => {
    if (!encodedUrl || !encodedUrl.length) {
      return;
    }
    try{
      return decodeNotebookURL(encodedUrl)
    } catch(e) {
      console.warn(e)
    }
  }, [ encodedUrl ])
  const { data, error, status } = useGetJSON({ url, delay: 1000})
  if (error) {
    console.error(error)
    return <div>Error <pre>{JSON.stringify(error, null, 2)}</pre></div>
  }
  console.info('Notebook render:', url ,'from', encodedUrl, status)

  const switchLayer = () => {
    setLayer(layer === DisplayLayerHermeneutics
      ? null
      : DisplayLayerHermeneutics
    )
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
  return (
    <div>
    <button onClick={switchLayer} style={{position: 'fixed', top: 200, zIndex:1004}}>Change layer {layer}</button>
    {status === StatusSuccess
      ? <Article ipynb={data} memoid={encodedUrl}/>
      : null
    }
    </div>
  )
}

export default NotebookViewer

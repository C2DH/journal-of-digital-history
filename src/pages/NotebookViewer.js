import React, { useMemo, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { decodeNotebookURL } from '../logic/ipynb'
import { BootstrapColumLayout, StatusSuccess, StatusFetching, StatusIdle } from '../constants'
import Article from './Article'
import Loading from '../components/Loading'

/**
 * Loading bar inspired by
 * https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/animating-auto
 */
const NotebookViewer = ({ match: { params: { encodedUrl }}}) => {
  const { t } = useTranslation()
  const [animatedProps, api] = useSpring(() => ({ width : 0, opacity:1, config: config.slow }))

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
  const onDownloadProgress = (e) => {
    console.info('onDownloadProgress', e.total, e.loaded)
    if (e.total && e.loaded) {
      if (e.loaded < e.total) {
        api.start({ width: 100 * e.loaded / e.total })
      }
    }
  }
  const { data, error, status } = useGetJSON({ url, delay: 1000, onDownloadProgress })

  useEffect(() => {
    if(status === StatusFetching) {
      api.start({ width: 10, opacity: 1 })
    } else if(status === StatusSuccess) {
      api.start({ width: 100, opacity: 0 })
    }
  }, [status])

  if (error) {
    console.error(error)
    return <div>Error <pre>{JSON.stringify(error, null, 2)}</pre></div>
  }
  // console.info('Notebook render:', url ,'from', encodedUrl, status)
  return (
    <>
      <div className="position-fixed w-100" style={{
        top: 0,
        left: 0,
        zIndex: 3
      }}>
        <animated.div className="NotebookViewer_loading position-absolute" style={{
          width: animatedProps.width.interpolate(x => `${x}%`),
          opacity: animatedProps.opacity
        }}/>
        <animated.span className="NotebookViewer_loadingPercentage monospace" style={{
          opacity: animatedProps.opacity
        }}>{animatedProps.width.to(x => `${Math.round(x * 10000) / 10000}%`)}</animated.span>
      </div>
      {status === StatusSuccess ? null: (
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
      )}
      {status !== StatusSuccess ? null: (
        <Article ipynb={data} memoid={encodedUrl}/>
      )}
    </>
  )
}

export default NotebookViewer

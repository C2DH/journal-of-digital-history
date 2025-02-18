import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { useGetJSON } from '../logic/api/fetchData'
import { StatusSuccess, StatusFetching } from '../constants'
import { useSpring, a, animated, config } from 'react-spring'
import { parseNotebook } from '../logic/fingerprint'
import { useBoundingClientRect } from '../hooks/graphics'
import ArticleFingerprint from '../components/Article/ArticleFingerprint'

import ErrorViewer from './ErrorViewer'



const FingerprintLoader = ({ url, delay=0 }) => {
  const { t } = useTranslation()
  const tooltipText = useRef({ idx: '', text: '', heading: ''});
  const [animatedProps, api] = useSpring(() => ({ width : 0, opacity:1, config: config.slow }))
  const [animatedTooltipProps, tooltipApi] = useSpring(() => ({
    x : 0, y: 0, opacity:1,
    backgroundColor: 'var(--secondary)',
    color: 'var(--white)',
    config: config.stiff
  }))
  const { data, error, status } = useGetJSON({
    url,
    delay,
    onDownloadProgress: (e) => {
      console.debug('onDownloadProgress', e.total, e.loaded)
      if (e.total && e.loaded) {
        if (e.loaded < e.total) {
          api.start({ width: 100 * e.loaded / e.total })
        }
      }
    }
  })
  const [{ left, width:size }, ref] = useBoundingClientRect()

  const fingerprintData = status === StatusSuccess ? parseNotebook(data): null



  const onMouseMoveHandler = (e, datum) => {
    if( tooltipText.current.idx !== datum.idx ) {
      tooltipText.current.text = datum.firstWords
      tooltipText.current.heading = datum.firstWordsHeading
    }
    tooltipApi.start({
      x: e.clientX - left +ref.current.parentNode.offsetLeft,
      y: e.clientY - 50,
      color: datum.type === 'code'
        ? 'var(--white)'
        : datum.isHermeneutic
          ? 'var(--secondary)'
          : 'var(--white)',
      backgroundColor: datum.type === 'code'
        ? 'var(--accent)'
        : datum.isHermeneutic
          ? 'var(--primary)'
          : 'var(--secondary)',
      opacity: 1
    })
  }
  const onMouseOutHandler = () => {
    tooltipApi.start({ opacity: 0 })
  }

  useEffect(() => {
    if (status === StatusFetching) {
      api.start({ width: 10, opacity: 1 })
    } else if(status === StatusSuccess) {
      api.start({ width: 100, opacity: 0 })
    }
  }, [status])

  return (
    <>
    <a.div className="ArticleFingerprintTooltip position-fixed top-0" style={{
      ...animatedTooltipProps
    }}>
      <a.span className="ArticleFingerprintTooltip_heading">{animatedTooltipProps.x.to(() => String(tooltipText.current.heading))}</a.span>
      <br />
      <a.span>{animatedTooltipProps.x.to(() => String(tooltipText.current.text))}</a.span>
    </a.div>
    <div className="position-fixed w-100" style={{
      top: 0,
      left: 0,
      zIndex: 3
    }}>
      <animated.div className="NotebookViewer_loading position-absolute" style={{
        width: animatedProps.width.to(x => `${x}%`),
        opacity: animatedProps.opacity
      }}/>
      <animated.span className="NotebookViewer_loadingPercentage monospace" style={{
        opacity: animatedProps.opacity
      }}>{animatedProps.width.to(x => `${Math.round(x * 10000) / 10000}%`)}</animated.span>
    </div>
    {error ? <ErrorViewer error={error} errorCode={404} /> : (
      <Container className="page">
        <Row>
          <Col {...BootstrapColumLayout}>
            <h1 className="my-5">{t('pages.fingerprintViewerForm.title')}</h1>
          </Col>
        </Row>
        <Row>
          <Col className="bg-transparent" {...BootstrapColumLayout} style={{ height: size }}>
            <div ref={ref} onMouseOut={onMouseOutHandler}>
              {fingerprintData ?
                <ArticleFingerprint
                  debug={true}
                  onMouseMove={onMouseMoveHandler}
                  stats={fingerprintData.stats}
                  cells={fingerprintData.cells}
                  size={size}
                  margin={20}
                />
              : null}
            </div>
          </Col>
        </Row>
      </Container>
    )}
    </>
  )
}
/**
 * THis component displays the form where we can add the notebook
 * url. On submit, it checks the validity of the url
 * then forward the user to the fingerprint-viewer?ipynb=<url> page
 * (which is handled by another component `FingerprintViewer`
 */
const FingerprintViewer = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [ipynbUrl, setIpynbUrl] = useQueryParam('url', withDefault(StringParam, ''))
  console.info('initial url', ipynbUrl)
  const handleSubmit = () => {
    console.info('@submit', value)
    // is a vaild, full url
    setIpynbUrl(value)
    // eslint-disable-next-line
    // debugger
    // history.push({
    //   pathname: generatePath("/:lang/fingerprint-viewer", {
    //     lang: i18n.language.split('-')[0]
    //   }),
    //   search: `?ipynb=${value}`
    // })
  }
  const isValidUrl = ipynbUrl.match(/^https?:\/\/[^ "]+$/)

  if (isValidUrl) {
    return <FingerprintLoader url={ipynbUrl}/>
  }
  return (
    <Container className="page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">{t('pages.fingerprintViewerForm.title')}</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mt-5 mb-3" controlId="">
              <Form.Label>{t('forms.fingerprintViewerForm.notebookUrl')}</Form.Label>
              <Form.Control
                defaultValue={value}
                onChange={(e) => setValue(e.target.value)}
                type="url"
                placeholder="https://"
              />
              <Form.Text className="text-muted" dangerouslySetInnerHTML={{
                __html: t('forms.fingerprintViewerForm.notebookUrlDescription')
              }}/>
            </Form.Group>
            <Button type="submit" variant="outline-secondary" size="sm">Preview Fingerprint</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default FingerprintViewer

import React, { useMemo, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
// import { useTranslation } from 'react-i18next'

import { useGetJSON } from '../logic/api/fetchData'
import { decodeNotebookURL } from '../logic/ipynb'
import { StatusSuccess, StatusFetching } from '../constants'
import Article from '../components/Article'
// import ArticleKeywords from '../components/Article/ArticleKeywords'
import ArticleHeader from '../components/Article/ArticleHeader'

/**
 * Loading bar inspired by
 * https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/animating-auto
 */
const NotebookViewer = ({
  match: { params: { encodedUrl }},
  title=[], abstract=[], keywords=[],
  contributor=[],
  collaborators=[],
  disclaimer=[],
  publicationDate,
  publicationStatus,
  plainTitle,
  plainContributor = '',
  excerpt,
  binderUrl,
  emailAddress,
  issue,
  doi,
  bibjson,
  pid,
}) => {
  // const { t } = useTranslation()
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
    console.debug('onDownloadProgress', e.total, e.loaded)
    if (e.total && e.loaded) {
      if (e.loaded < e.total) {
        api.start({ width: 100 * e.loaded / e.total })
      }
    }
  }
  const { data, error, status } = useGetJSON({ url, delay: 200, onDownloadProgress })

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
      {status === StatusSuccess
        ? (
          <Article
            ipynb={data}
            memoid={encodedUrl}
            binderUrl={binderUrl}
            emailAddress={emailAddress}
            publicationDate={publicationDate}
            publicationStatus={publicationStatus}
            issue={issue}
            doi={doi}
            bibjson={bibjson}
            pid={pid}
            plainTitle={plainTitle}
            excerpt={excerpt}
            plainKeywords={keywords}
            plainContributor={plainContributor}
          />
        )
        : (
          <ArticleHeader className="page mt-5"
            title={title}
            abstract={abstract}
            keywords={keywords}
            collaborators={collaborators}
            contributor={contributor}
            publicationDate={publicationDate}
            url={url}
            disclaimer={disclaimer}
            publicationStatus={publicationStatus}
            issue={issue}
            doi={doi}
            bibjson={bibjson}
            isPreview
          />
        )
      }
    </>
  )
}

export default NotebookViewer

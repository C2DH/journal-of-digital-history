import React, { useMemo, useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { useQueryParams, NumberParam, withDefault } from 'use-query-params'
import { useGetJSON } from '../logic/api/fetchData'
import { decodeNotebookURL } from '../logic/ipynb'
import {
  StatusSuccess,
  StatusError,
  StatusFetching,
  ArticleVersionQueryParam
} from '../constants'
import Article from '../components/Article'
import ArticleV2 from '../components/ArticleV2'
import ArticleHeader from '../components/Article/ArticleHeader'
import ErrorViewer from './ErrorViewer'
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
  isJavascriptTrusted
}) => {
  const [{[ArticleVersionQueryParam]: version}] = useQueryParams({
    [ArticleVersionQueryParam]: withDefault(NumberParam, 2)
  })
  const ArticleComponent = version === 2 ? ArticleV2 : Article
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
    console.debug('[NotebookViewer] onDownloadProgress', e.total, e.loaded)
    if (e.total && e.loaded) {
      if (e.loaded < e.total) {
        api.start({ width: 100 * e.loaded / e.total })
      }
    }
  }
  const { data, error, status } = useGetJSON({
    url, delay: 200,
    timeout: process.env.REACT_APP_API_TIMEOUT,
    onDownloadProgress
  })

  useEffect(() => {
    if(status === StatusFetching) {
      api.start({ width: 10, opacity: 1 })
    } else if(status === StatusSuccess) {
      api.start({ width: 100, opacity: 0 })
    } else if(status === StatusError) {
      api.start({
        width: 0,
        opacity: 0
      })
    }
  }, [status])

  // console.info('Notebook render:', url ,'from', encodedUrl, status)
  return (
    <>
      <div className="NotebookViewer_loadingWrapper position-fixed w-100 top-0 left-0">
        <animated.div className="NotebookViewer_loading position-absolute" style={{
          width: animatedProps.width.interpolate(x => `${x}%`),
          opacity: animatedProps.opacity
        }}/>
        <animated.span className="NotebookViewer_loadingPercentage monospace" style={{
          opacity: animatedProps.opacity
        }}>{animatedProps.width.to(x => `${Math.round(x * 10000) / 10000}%`)}</animated.span>
      </div>
      {status === StatusError && <ErrorViewer error={error} errorCode={error.code} />}
      {status === StatusSuccess
        ? (
          <ArticleComponent
            ipynb={data}
            memoid={encodedUrl}
            isLocal={data.content !== 'undefined'}
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
            isJavascriptTrusted={isJavascriptTrusted}
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

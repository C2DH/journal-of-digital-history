import React, { useMemo, useEffect } from 'react'
import { useQueryParams, NumberParam, withDefault } from 'use-query-params'
import { useGetJSON } from '../logic/api/fetchData'
import { decodeNotebookURL } from '../logic/ipynb'
import {
  StatusSuccess,
  StatusError,
  StatusFetching,
  ArticleVersionQueryParam,
  URLPathsAlwaysTrustJS,
} from '../constants'
import Article from '../components/Article'
import ArticleV2 from '../components/ArticleV2'
import ArticleV3 from '../components/ArticleV3'
import ArticleHeader from '../components/Article/ArticleHeader'
import ErrorViewer from './ErrorViewer'
import { useArticleStore, usePropsStore } from '../store'
import { setBodyNoScroll } from '../logic/viewport'
/**
 * Loading bar inspired by
 * https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/animating-auto
 */
const NotebookViewer = ({
  match: {
    params: { encodedUrl },
  },
  title = [],
  abstract = [],
  keywords = [],
  contributor = [],
  collaborators = [],
  disclaimer = [],
  publicationDate,
  publicationStatus,
  plainTitle,
  plainContributor = '',
  excerpt,
  binderUrl,
  repositoryUrl,
  dataverseUrl,
  emailAddress,
  issue,
  doi,
  bibjson,
  pid,
  isJavascriptTrusted,
  parserVersion = 2
}) => {
  const [{ [ArticleVersionQueryParam]: version }] = useQueryParams({
    [ArticleVersionQueryParam]: withDefault(NumberParam, parserVersion),
  })
  const ArticleComponent = version === 3 ? ArticleV3 : version === 2 ? ArticleV2 : Article
  const setLoadingProgress = usePropsStore((state) => state.setLoadingProgress)
  const clearIframeHeader  = useArticleStore((state) => state.clearIframeHeader);
  const setArticleVersion = useArticleStore((state) => state.setArticleVersion);
  setArticleVersion(version);

  const url = useMemo(() => {
    if (!encodedUrl || !encodedUrl.length) {
      console.error(
        '[NotebookViewer] no encodedUrl was provided.\nThe encoded url is required as it contains the notebook url',
      )
      return
    }
    try {
      return decodeNotebookURL(encodedUrl)
    } catch (e) {
      console.error(
        '[NotebookViewer] bqd encodedUrl provided',
        encodedUrl,
        '\nThe encoded url is required as it contains the notebook url',
      )
      console.error(e)
    }
  }, [encodedUrl])

  //  issue #701: Plotly problem due to isolation mode
  useEffect(() => {
    clearIframeHeader();
  }, [url]);

  const isJavascriptTrustedByOrigin =
    typeof url === 'string' ? URLPathsAlwaysTrustJS.some((d) => url.indexOf(d) === 0) : false

  const onDownloadProgress = (e) => {
    console.debug('[NotebookViewer] onDownloadProgress url', url, e.total, e.loaded)
    if (!e.total && e.loaded > 0) {
      // euristic average zise of a notebook
      setLoadingProgress(e.loaded / 23810103, url)
    } else if (e.total && e.loaded) {
      if (e.loaded < e.total) {
        setLoadingProgress(e.loaded / e.total, url)
      }
    }
  }
  const { data, error, status } = useGetJSON({
    url,
    delay: 200,
    timeout: process.env.REACT_APP_API_TIMEOUT,
    onDownloadProgress,
  })

  useEffect(() => {
    if (status === StatusFetching) {
      setLoadingProgress(0.05, url)
    } else if (status === StatusSuccess) {
      setLoadingProgress(1, url)
    } else if (status === StatusError) {
      setLoadingProgress(0, url)
    }
  }, [status])

  useEffect(() => {
    if (version === 3) {
      setBodyNoScroll(false)
    }
  }, [version])

  console.debug(
    '[NotebookViewer] javascript support by origin:',
    isJavascriptTrustedByOrigin,
    'by db:',
    isJavascriptTrusted,
  )
  return (
    <>
      {status === StatusError && <ErrorViewer error={error} errorCode={error.code} />}
      {status === StatusSuccess ? (
        <ArticleComponent
          ipynb={data}
          memoid={encodedUrl}
          isLocal={data.content !== 'undefined'}
          binderUrl={binderUrl}
          repositoryUrl={repositoryUrl}
          dataverseUrl={dataverseUrl}
          emailAddress={emailAddress}
          publicationDate={publicationDate}
          publicationStatus={publicationStatus}
          issue={issue}
          url={url}
          doi={doi}
          bibjson={bibjson}
          pid={pid}
          plainTitle={plainTitle}
          excerpt={excerpt}
          plainKeywords={keywords}
          plainContributor={plainContributor}
          isJavascriptTrusted={isJavascriptTrustedByOrigin || isJavascriptTrusted}
        />
      ) : (
        <ArticleHeader
          className="page mt-2"
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
      )}
    </>
  )
}

export default NotebookViewer

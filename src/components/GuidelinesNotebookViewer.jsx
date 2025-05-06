import React, { useEffect } from 'react'
import { getRawNotebookUrl } from '../logic/notebook'
import { useGetJSON } from '../logic/api/fetchData'
import { useIpynbNotebook } from '../hooks/ipynb'
import ArticleFlow from './ArticleV2/ArticleFlow'
import ErrorViewer from '../pages/ErrorViewer'
// import { StatusSuccess } from '../constants'
import { usePropsStore } from '../store'
import ArticleTree from '../models/ArticleTree'

const DefaultArticleTree = new ArticleTree({})

const GuidelinesNotebookViewer = ({
  memoid = '',
  notebookUrl = '',
  plainTitle = null,
  height,
  width,
  children,
}) => {
  const setLoadingProgress = usePropsStore((state) => state.setLoadingProgress)
  const { status, error, data } = useGetJSON({
    memoid,
    url: notebookUrl.length === 0 ? null : getRawNotebookUrl(notebookUrl),
    delay: 100,
    onCompleted: () => {
      console.debug('[GuidelinesNotebookViewer] onDownloadProgress url', notebookUrl, 'done.')
      setLoadingProgress(1, notebookUrl)
    },
    onDownloadProgress: (e) => {
      console.debug(
        '[GuidelinesNotebookViewer] onDownloadProgress url',
        notebookUrl,
        e.total,
        e.loaded,
      )
      if (!e.total && e.loaded > 0) {
        // euristic average zise of a notebook
        setLoadingProgress(e.loaded / 23810103, notebookUrl)
      } else if (e.total && e.loaded) {
        if (e.loaded < e.total) {
          setLoadingProgress(e.loaded / e.total, notebookUrl)
        }
      }
    },
  })
  const { status: treeStatus, tree: articleTree } = useIpynbNotebook({
    id: memoid,
    cells: data?.cells || [],
    metadata: data?.metadata || {},
    enabled: status === 'success',
  })

  console.info(
    '[GuidelinesNotebookViewer] \n - memoid: ',
    memoid,
    '\n - notebookUrl:',
    notebookUrl,
    '\n - status:',
    status,
    '\n - treeStatus:',
    treeStatus,
    error,
    articleTree,
  )

  useEffect(() => {
    if (treeStatus === 'success') {
      setLoadingProgress(1, notebookUrl)
    } else {
      setLoadingProgress(0.8, notebookUrl)
    }
  }, [treeStatus])
  if (error) {
    return <ErrorViewer error={error} />
  }
  const tree = treeStatus === 'success' && articleTree !== null ? articleTree : DefaultArticleTree
  return (
    <div className="page">
      {/* loaded: {status}
      <br />
      nb: {treeStatus} {memoid} */}
      <ArticleFlow
        memoid={memoid + status + treeStatus}
        height={height}
        width={width}
        paragraphs={tree.paragraphs}
        headingsPositions={tree.headingsPositions}
        hasBibliography={!!tree.bibliography}
        isJavascriptTrusted={true}
        articleTree={tree}
        ignoreBinder={true}
        plainTitle={plainTitle}
        onDataHrefClick={() => {}}
      >
        {children}
      </ArticleFlow>
    </div>
  )
}

export default GuidelinesNotebookViewer

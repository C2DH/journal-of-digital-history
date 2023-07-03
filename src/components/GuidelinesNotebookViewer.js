import React from 'react'
import { getRawNotebookUrl } from '../logic/notebook'
import { useGetJSON } from '../logic/api/fetchData'
import { useIpynbNotebook } from '../hooks/ipynb'
import ArticleFlow from './ArticleV2/ArticleFlow'
import ErrorViewer from '../pages/ErrorViewer'
import { StatusSuccess } from '../constants'

const GuidelinesNotebookViewer = ({
  memoid = '',
  notebookUrl = '',
  plainTitle = null,
  height,
  width,
  children,
}) => {
  const { status, error, data } = useGetJSON({
    url: notebookUrl.length === 0 ? null : getRawNotebookUrl(notebookUrl),
    delay: 0,
  })
  const { status: treeStatus, tree: articleTree } = useIpynbNotebook({
    id: memoid,
    cells: data?.cells || [],
    metadata: data?.metadata || {},
    enabled: status === StatusSuccess,
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
  if (error) {
    return <ErrorViewer error={error} />
  }
  return (
    <div className="page">
      <ArticleFlow
        memoid={memoid + treeStatus}
        height={height}
        width={width}
        paragraphs={articleTree?.paragraphs}
        headingsPositions={articleTree?.headingsPositions}
        hasBibliography={!!articleTree?.bibliography}
        isJavascriptTrusted={true}
        articleTree={articleTree}
        ignoreBinder={true}
        plainTitle={plainTitle}
      >
        {children}
      </ArticleFlow>
    </div>
  )
}

export default GuidelinesNotebookViewer

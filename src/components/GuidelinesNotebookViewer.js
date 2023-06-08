import React from 'react'
import { getRawNotebookUrl } from '../logic/notebook'
import { useGetJSON } from '../logic/api/fetchData'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleFlow from './ArticleV2/ArticleFlow'
import ErrorViewer from '../pages/ErrorViewer'
// import ArticleCell from './Article/ArticleCell'

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
  const articleTree = useIpynbNotebookParagraphs({
    id: memoid + notebookUrl + status,
    cells: data?.cells || [],
    metadata: data?.metadata || {},
  })
  console.debug(
    '[GuidelinesNotebookViewer] \n - memoid: ',
    memoid,
    '\n - notebookUrl:',
    notebookUrl,
    status,
    articleTree,
    error,
  )
  if (error) {
    return <ErrorViewer error={error} />
  }
  return (
    <div className="page">
      <ArticleFlow
        memoid={memoid + notebookUrl + status}
        height={height}
        width={width}
        paragraphs={articleTree.paragraphs}
        headingsPositions={articleTree.headingsPositions}
        hasBibliography={!!articleTree.bibliography}
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

import React from 'react'
import { getRawNotebookUrl } from '../logic/notebook'
import { useGetJSON } from '../logic/api/fetchData'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleFlow from './ArticleV2/ArticleFlow'
// import ArticleCell from './Article/ArticleCell'

const GuidelinesNotebookViewer = ({ notebookUrl, height, width, children }) => {
  const { status, error, data } = useGetJSON({
    url: typeof notebookUrl !== 'string' ? null : getRawNotebookUrl(notebookUrl),
    delay: 100,
  })
  const articleTree = useIpynbNotebookParagraphs({
    id: notebookUrl + '-' + status,
    cells: data?.cells || [],
    metadata: data?.metadata || {},
  })
  console.debug('[GuidelinesNotebookViewer] notebookUrl:', notebookUrl, status, articleTree)

  return (
    <div>
      popopopopopopo
      {status === 'fetching' && <div>Loading...</div>}
      {status === 'error' && <div>Error: {error}</div>}
      {status === 'success' && (
        <ArticleFlow
          memoid={notebookUrl || 'guidelines'}
          height={height}
          width={width}
          paragraphs={articleTree.paragraphs}
          headingsPositions={articleTree.headingsPositions}
          hasBibliography={!!articleTree.bibliography}
          isJavascriptTrusted={true}
          articleTree={articleTree}
          ignoreBinder={true}
        >
          {children}
        </ArticleFlow>
      )}
    </div>
  )
}

export default GuidelinesNotebookViewer

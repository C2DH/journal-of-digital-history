import React from 'react'
import { useIpynbNotebookParagraphs } from '../../hooks/ipynb'
import { useCurrentWindowDimensions } from '../../hooks/graphics'
import ArticleHeader from '../Article/ArticleHeader'
import ArticleFlow from './ArticleFlow'


const Article = ({
  // pid,
  // Notebook instance, an object containing {cells:[], metadata:{}}
  ipynb,
  url,
  publicationDate = new Date(),
  publicationStatus,
  issue,
  // plainTitle,
  // plainContributor = '',
  // plainKeywords = [],
  // excerpt,
  doi,
  // binderUrl,
  bibjson,
  // emailAddress
}) => {
  const { height, width } =  useCurrentWindowDimensions()
  const articleTree = useIpynbNotebookParagraphs({
    id: url,
    cells: ipynb?.cells ?? [],
    metadata: ipynb?.metadata ?? {}
  })
  const {
    title,
    abstract,
    keywords,
    contributor,
    collaborators,
    disclaimer = []
  } = articleTree.sections
  console.debug('[Article] component rendered')
  return (
    <>
    <div className="page">
      <a id="top" className="anchor"></a>
      <ArticleFlow
        memoid={articleTree.id}
        height={height}
        width={width}
        cells={articleTree.paragraphs}
      >
        <ArticleHeader
          className="mt-5"
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
          isPreview={false}
        />
      </ArticleFlow>
    </div>
    </>
  )
}

export default Article

import React, { useState } from 'react'
import { useIpynbNotebookParagraphs } from '../../hooks/ipynb'
import { useCurrentWindowDimensions } from '../../hooks/graphics'
import ArticleHeader from '../Article/ArticleHeader'
import ArticleNote from '../Article/ArticleNote'
import ArticleFlow from './ArticleFlow'
import ArticleHelmet from './ArticleHelmet'
import ArticleBibliography from '../Article/ArticleBibliography'
import Footer from '../Footer'

const Article = ({
  // pid,
  // Notebook instance, an object containing {cells:[], metadata:{}}
  ipynb,
  url,
  imageUrl,
  publicationDate = new Date(),
  publicationStatus,
  issue,
  plainTitle,
  plainContributor = '',
  plainKeywords = [],
  excerpt,
  doi,
  binderUrl,
  bibjson,
  emailAddress,
  isJavascriptTrusted=false
}) => {
  const [selectedDataHref, setSelectedDataHref] = useState(null)
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


  console.debug(`[Article] component rendered ${width}x${height}px`)
  console.debug('[Article] loading articleTree anchors:', articleTree.anchors)

  const onDataHrefClickHandler = (d) => {
    console.debug('DataHref click handler')
    setSelectedDataHref(d)
  }
  const renderedBibliographyComponent = (
    <ArticleBibliography articleTree={articleTree} noAnchor className="mt-0"/>
  )
  const renderedFooterComponent = (<Footer />)



  return (
    <>
    <ArticleHelmet
      url={url}
      imageUrl={imageUrl}
      plainTitle={plainTitle}
      plainContributor={plainContributor}
      plainKeywords={plainKeywords}
      publicationDate={publicationDate}
      issue={issue}
      excerpt={excerpt}
    />
    <div className="page">
      <a id="top" className="anchor"></a>
      <ArticleFlow
        memoid={articleTree.id}
        height={height}
        width={width}
        paragraphs={articleTree.paragraphs}
        headingsPositions={articleTree.headingsPositions}
        hasBibliography={typeof articleTree.bibliography === 'object'}
        binderUrl={binderUrl}
        emailAddress={emailAddress}
        onDataHrefClick={onDataHrefClickHandler}
        isJavascriptTrusted={isJavascriptTrusted}
        articleTree={articleTree}
        renderedBibliographyComponent={renderedBibliographyComponent}
        renderedFooterComponent={renderedFooterComponent}
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
      {articleTree.citationsFromMetadata
        ? <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref}/>
        : null
      }

    </div>
    </>
  )
}

export default Article

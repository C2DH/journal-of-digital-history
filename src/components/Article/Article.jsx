import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import ArticleText from './ArticleText'
import ArticleHeader from './ArticleHeader'
import ArticleBilbiography from './ArticleBibliography'
import ArticleNote from './ArticleNote'
import ArticleTextShadow from './ArticleTextShadow'
import ArticleStream from './ArticleStream'
import ArticleMobileDisclaimer from './ArticleMobileDisclaimer'
import source from '../../data/mock-ipynb.nbconvert.json'
import { useIpynbNotebookParagraphs } from '../../hooks/ipynb'
import { useCurrentWindowDimensions } from '../../hooks/graphics'
import { scrollToElementById } from '../../logic/viewport'
import {
  LayerNarrativeStep,
  LayerNarrative,
  DisplayLayerHermeneutics,
  DisplayLayerNarrative,
  IsMobile,
} from '../../constants'

const Article = ({
  pid,
  ipynb,
  url,
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
}) => {
  // const { layer = LayerNarrative } = useParams() // hermeneutics, hermeneutics+data, narrative
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const articleTree = useIpynbNotebookParagraphs({
    id: url,
    cells: ipynb ? ipynb.cells : source.cells,
    metadata: ipynb ? ipynb.metadata : source.metadata,
  })
  const {
    title,
    abstract,
    keywords,
    contributor,
    collaborators,
    disclaimer = [],
  } = articleTree.sections
  const { height, width } = useCurrentWindowDimensions()
  const hasBibliography = typeof articleTree.bibliography === 'object'
  // reload zotero and check current hash
  useEffect(() => {
    document.dispatchEvent(
      new Event('ZoteroItemUpdated', {
        bubbles: true,
        cancelable: true,
      }),
    )
    // check current hash
    let timer = 0
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (window.location.hash.length) {
        const id = window.location.hash.replace('#', '')
        scrollToElementById(id)
      }
    }, 50)
    return () => {
      clearTimeout(timer)
    }
  }, [pid])

  return (
    <>
      <Helmet>
        <meta property="og:site_name" content="Journal of Digital history" />
        <meta property="og:title" content={plainTitle} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE__BASEURL}/img/articles/${pid}.png`}
        />
        <meta
          property="og:url"
          content={import.meta.env.VITE__BASEURL + window.location.pathname}
        />
        <meta property="article:author" content={plainContributor} />
        <meta
          property="article:published_time"
          content={publicationDate.toISOString().split('T').shift()}
        />
        <meta property="article:section" content={issue?.pid || ''} />
        {plainKeywords.map((k, i) => (
          <meta key={i} property="article:tag" content={k} />
        ))}
        <meta name="dc:title" content={plainTitle} />
        <meta name="dc:publisher" content="DeGruyter" />
        {plainContributor.split(', ').map((d, i) => (
          <meta key={i} name="dc:creator" content={d} />
        ))}
        {/*
        dc:title     Studying E-Journal User Behavior Using Log Files
        dc:creator 	  	Yu, L
        dc:creator 	  	Apps, A
        dc:subject 	https://purl.org/dc/terms/DDC 	020
        dc:subject 	https://purl.org/dc/terms/LCC 	Z671
        dc:publisher 	  	Elsevier
        dc:type 	https://purl.org/dc/terms/DCMIType 	Text
        dcterms:issued 	https://purl.org/dc/terms/W3CDTF 	2000
        dcterms:isPartOf 	  	  	urn:ISSN:0740-8188
        dcterms:bibliographicCitation
        */}
      </Helmet>
      <ArticleTextShadow
        doi={doi}
        issue={issue}
        publicationDate={publicationDate}
        title={title}
        height={height}
        width={width}
        publicationStatus={publicationStatus}
      >
        <ArticleStream
          memoid={articleTree.id}
          cells={articleTree.paragraphs}
          shadowLayers={[LayerNarrativeStep, LayerNarrative]}
          onDataHrefClick={(d) => setSelectedDataHref(d)}
          anchorPrefix={DisplayLayerHermeneutics}
        />
      </ArticleTextShadow>
      <div className="page">
        <a id="top" className="anchor"></a>
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
        {IsMobile ? <ArticleMobileDisclaimer title={plainTitle} /> : null}
        <ArticleText
          memoid={articleTree.id}
          headingsPositions={articleTree.headingsPositions}
          paragraphs={articleTree.paragraphs}
          paragraphsPositions={articleTree.paragraphsPositions}
          onDataHrefClick={(d) => setSelectedDataHref(d)}
          height={height}
          width={width}
          anchorPrefix={DisplayLayerNarrative}
          hasBibliography={hasBibliography}
          binderUrl={binderUrl}
          emailAddress={emailAddress}
          {...{ title, abstract, keywords, contributor, publicationDate, url, disclaimer }}
        />
        {articleTree.citationsFromMetadata ? (
          <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref} />
        ) : null}
        {hasBibliography ? <ArticleBilbiography articleTree={articleTree} /> : null}
      </div>
    </>
  )
}

export default React.memo(Article, (nextProps, prevProps) => {
  if (nextProps.memoid === prevProps.memoid) {
    return true
  }
  return false
})

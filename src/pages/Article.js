import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import ArticleNote from '../components/Article/ArticleNote'
import ArticleTextShadow from '../components/Article/ArticleTextShadow'
import ArticleStream from '../components/Article/ArticleStream'
import ArticleMobileDisclaimer from '../components/Article/ArticleMobileDisclaimer'
import source from '../data/mock-ipynb.nbconvert.json'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import { useCurrentWindowDimensions } from '../hooks/graphics'
import { LayerNarrativeStep, LayerNarrative, DisplayLayerHermeneutics, DisplayLayerNarrative, IsMobile } from '../constants'


const Article = ({ pid, ipynb, url,
  publicationDate = new Date(),
  publicationStatus,
  issue,
  plainTitle,
  excerpt,
  doi, binderUrl, bibjson, emailAddress }) => {
  // const { layer = LayerNarrative } = useParams() // hermeneutics, hermeneutics+data, narrative
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const articleTree = useIpynbNotebookParagraphs({
    id: url,
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  })
  const { title, abstract, keywords, contributor, collaborators, disclaimer = [] } = articleTree.sections
  const { height, width } =  useCurrentWindowDimensions()
  const hasBibliography = typeof articleTree.bibliography === 'object'
  // reload zotero
  useEffect(() => {
    document.dispatchEvent(new Event('ZoteroItemUpdated', {
      bubbles: true,
      cancelable: true
    }))
  }, [pid])

  return (
    <>
    <Helmet>
      <meta property="og:site_name" content="Journal of Digital history" />
      <meta property="og:title" content={plainTitle} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={`${window.location.origin}/img/articles/${pid}.png`} />
      <meta property="og:url" content={window.location} />
      <meta name="dc:title" content={plainTitle}	/>
      <meta name="dc:publisher" content="DeGruyter" />
      {/*
        dc:title     Studying E-Journal User Behavior Using Log Files
        dc:creator 	  	Yu, L
        dc:creator 	  	Apps, A
        dc:subject 	http://purl.org/dc/terms/DDC 	020
        dc:subject 	http://purl.org/dc/terms/LCC 	Z671
        dc:publisher 	  	Elsevier
        dc:type 	http://purl.org/dc/terms/DCMIType 	Text
        dcterms:issued 	http://purl.org/dc/terms/W3CDTF 	2000
        dcterms:isPartOf 	  	  	urn:ISSN:0740-8188
        dcterms:bibliographicCitation
        */
      }
    </Helmet>
    <ArticleTextShadow
      doi={doi}
      publicationDate={publicationDate}
      title={title}
      height={height}
      width={width}
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
      {IsMobile ? <ArticleMobileDisclaimer title={plainTitle}/> :null}
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
        {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }}
      />
      {articleTree.citationsFromMetadata
        ? <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref}/>
        : null
      }
      {hasBibliography
        ? (<ArticleBilbiography articleTree={articleTree} />)
        : null
      }
    </div>
    </>
  );
}

export default React.memo(Article, (nextProps, prevProps) => {
  if (nextProps.memoid === prevProps.memoid) {
    return true
  }
  return false
})

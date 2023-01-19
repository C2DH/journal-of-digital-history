import React, { useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet'

const ArticleHelmet = ({
  url = '',
  imageUrl = '',
  plainTitle = '',
  excerpt = '',
  plainContributor = '',
  plainKeywords = [],
  issue,
  publicationDate = new Date(),
}) => {
  // apply zotero when the DOM is ready
  useLayoutEffect(() => {
    console.debug('[ArticleHelmet] @useLayoutEffect')
    document.dispatchEvent(
      new Event('ZoteroItemUpdated', {
        bubbles: true,
        cancelable: true,
      }),
    )
  }, [url])

  return (
    <Helmet>
      <meta property="og:site_name" content="Journal of Digital history" />
      <meta property="og:title" content={plainTitle} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={process.env.REACT_APP_BASEURL + window.location.pathname} />
      <meta property="article:author" content={plainContributor} />
      <meta
        property="article:published_time"
        content={publicationDate.toISOString().split('T').shift()}
      />
      <meta property="article:section" content={issue?.pid || ''} />
      {plainKeywords.map((k, i) => (
        <meta key={i} property="article:tag" content={k} />
      ))}
      <meta name="dc.title" content={plainTitle} />
      <meta name="dc.format" content="text/html" />
      <meta name="dc.publisher" content="DeGruyter" />
      <meta name="dc.type" content="OriginalPaper" />
      <meta name="dc.language" content="En" />
      {plainContributor.split(', ').map((d, i) => (
        <meta key={i} name="dc.creator" content={d} />
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
      {plainKeywords.map((k, i) => (
        <meta key={i} property="dc.subject" content={k} />
      ))}

      <meta name="citation_journal_title" content="Journal of Digital history" />
      <meta name="citation_journal_abbrev" content="JDH" />
      <meta name="citation_publisher" content="DeGruyter" />
      <meta name="citation_title" content={plainTitle} />
      <meta name="citation_issue" content={issue?.pid} />
    </Helmet>
  )
}

export default ArticleHelmet

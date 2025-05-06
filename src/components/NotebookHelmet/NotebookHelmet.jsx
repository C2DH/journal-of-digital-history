import React, { useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet'
import NotebookHelmetItem from './NotebookHelmetItem'

/**
 * Get OpenGraph and optionally Zotero metadata from the notebook metadata, if any available.
 * // https://github.com/jupyter/nbformat/blob/59e927d338b66f1b2cb14b5ebd07ea936a835119/nbformat/v4/nbformat.v4.schema.json#L63
 */
const NotebookHelmet = ({
  metadata={},
  // default og data in case no suitable items have been found
  defaultValues={},
  status
}) => {
  console.debug('[NotebookHelmet] notebook metadata: ', metadata)
  const htmlTitle = metadata.title || metadata.jdh?.helmet['og:title'] || defaultValues['og:title']
  const htmlDescription =  metadata.jdh?.helmet['og:description'] || defaultValues['og:description']
  // apply zotero when the DOM is ready
  useLayoutEffect(() => {
    console.debug('[CallForPaperHelmet] @useLayoutEffect status:', status)
    document.dispatchEvent(new Event('ZoteroItemUpdated', {
      bubbles: true,
      cancelable: true
    }))
  }, [status])

  const metaProperties = ([
    'og:image',
    'og:type',
    'og:description',
    'article:tag',
    'og:locale',
    'og:image:alt',
    'og:image:width',
    'og:image:height',
    'article:author',
    'article:published_time',
    'article:section',
    'article:tag'
  ].map((k) => NotebookHelmetItem({
    key: k,
    property: k,
    value: metadata.jdh?.helmet[k] || defaultValues[k] || ''
  })))

  const metaNames = ([
    'twitter:card',
    'twitter:site',
    'twitter:label1',
    'twitter:data1',
    'twitter:label2',
    'twitter:data2',
    'twitter:image:src',
  ].map((k) => NotebookHelmetItem({
    key: k,
    property: k,
    asName: true,
    value: metadata.jdh?.helmet[k] || defaultValues[k] || ''
  })))

  return  (
    <Helmet>
      <title>{htmlTitle}</title>
      <meta name="description" content={htmlDescription} />
      <meta name="dc:title" content={htmlTitle}/>
      <meta name="dc:publisher" content="DeGruyter" />
      <meta name="dc:creator" content="JDH" />
      <meta property="og:site_name" content="Journal of Digital history" />
      <meta property="og:url" content={import.meta.env.VITE_BASEURL + window.location.pathname} />
      <meta property="og:title" content={htmlTitle} />
      {metaProperties}
      {metaNames}
    </Helmet>
  )
}

export default NotebookHelmet

import React, { useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet'

/**
 * Get OpenGraph and Zotero metadata from the notebook metadata, if any available.
 * // https://github.com/jupyter/nbformat/blob/59e927d338b66f1b2cb14b5ebd07ea936a835119/nbformat/v4/nbformat.v4.schema.json#L63
 */
const NotebookHelmet = ({
  metadata={},
  status
}) => {
  console.debug('[NotebookHelmet] notebok metadata: ', metadata)
  // apply zotero when the DOM is ready
  useLayoutEffect(() => {
    console.debug('[CallForPaperHelmet] @useLayoutEffect status:', status)
    document.dispatchEvent(new Event('ZoteroItemUpdated', {
      bubbles: true,
      cancelable: true
    }))
  }, [status])

  return  (
    <Helmet>
      <meta property="og:site_name" content="Journal of Digital history" />
      <meta property="og:url" content={process.env.REACT_APP_BASEURL + window.location.pathname} />
      <meta property="og:title" content={metadata.title || metadata.jdh.helmet['og:title']} />
      {[
        'og:title',
        'og:image',
        'og:type',
        'og:description'
      ].map((k) => {
          let content = ''
          try {
            content = metadata.jdh.helmet[k]
          } catch {
            return null
          }
          return (
            <meta key={k} property={k} content={content} />
          )
      })}
    </Helmet>
  )
}

export default NotebookHelmet

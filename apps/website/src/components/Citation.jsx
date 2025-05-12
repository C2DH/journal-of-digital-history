import React from 'react'
import { Cite } from '@citation-js/core'
import '@citation-js/plugin-bibtex'

const DefaultBibJson = {
  title: 'Open Bibliography for Science, Technology and Medicine',
  author: [
    { name: 'Richard Jones' },
    { name: 'Mark MacGillivray' },
    { name: 'Peter Murray-Rust' },
    { name: 'Jim Pitman' },
    { name: 'Peter Sefton' },
    { name: "Ben O'Steen" },
    { name: 'William Waites' },
  ],
  type: 'article',
  year: '2011',
  journal: { name: 'Journal of Cheminformatics' },
  link: [{ url: 'http://www.jcheminf.com/content/3/1/47' }],
  identifier: [{ type: 'doi', id: '10.1186/1758-2946-3-47' }],
}

const Citation = ({
  bibjson,
  format = 'html',
  template = 'apa',
  ClipboardComponent = () => <div></div>,
  replaceFn,
  ...rest
}) => {
  if (!bibjson && !window.CITATION_DEMO) {
    return (
      <section {...rest}>
        <p>Not yet available, stay tuned!</p>
      </section>
    )
  }
  let bibjsonSource = bibjson ?? DefaultBibJson
  if (
    typeof bibjsonSource.issued === 'object' &&
    bibjsonSource.issued.year &&
    !bibjsonSource.issued['date-parts']
  ) {
    bibjsonSource.issued = {
      ...bibjsonSource.issued,
      ['date-parts']: [[bibjsonSource.issued.year]],
    }
  }
  const cite = new Cite(bibjsonSource)

  if (format === 'bibtex') {
    // format as bibtext and remove unwanted spaces from bibtext output when dealing with accented characters
    // e.g; change Fr{\' e}d{\' e}ric into Fr{\'e}d{\'e}ric
    const output = cite.format(format).replace(/\{\\'\s*/g, "{\\'")

    return (
      <>
        <section {...rest}>
          <pre>{output}</pre>
        </section>
        <ClipboardComponent text={output} />
      </>
    )
  }
  let output = cite.format('bibliography', {
    format,
    template,
  })
  if (typeof replaceFn === 'function') {
    output = replaceFn(output)
  }
  return (
    <>
      <section {...rest}>
        <p dangerouslySetInnerHTML={{ __html: output }} />
      </section>
      <ClipboardComponent text={output} />
    </>
  )
}

export default Citation

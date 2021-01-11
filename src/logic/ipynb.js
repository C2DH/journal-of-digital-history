import MarkdownIt from 'markdown-it'
import Cite from 'citation-js'
import MarkdownItAttrs from '@gerhobbelt/markdown-it-attrs'

import ArticleTree from '../models/ArticleTree'
import ArticleHeading from '../models/ArticleHeading'
import ArticleCell from '../models/ArticleCell'
import ArticleReference from '../models/ArticleReference'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

markdownParser.use(MarkdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['class']  // empty array = all attributes are allowed
});

const renderMarkdownWithReferences = ({
  sources = '',
  referenceIndex = {},
  citationsFromMetadata = {}
}) => {
  const references = []
  const content = markdownParser.render(sources)
    .replace(/&lt;sup&gt;(\d+)&lt;\/sup&gt;/, (m, num) => {
      // add footnote nuber and optionally the Author, year
      const reference = new ArticleReference({
        num,
        id: referenceIndex[num],
        ref: citationsFromMetadata[referenceIndex[num]],
      })
      references.push(reference)
      return `
        <span class="ArticleReference d-inline-block">
        <sup class="font-weight-bold">${num}</sup>
        <span class=" d-inline-block">
          <span class="ArticleReference_pointer"></span>
          <span class="ArticleReference_shortRef">${reference.shortRef}</span>
        </span>`
    })
  return {content, references}
}

const getArticleTreeFromIpynb = ({ cells=[], metadata={} }) => {
  const headings = [];
  const paragraphs = [];
  let bibliography = null;
  const citationsFromMetadata = metadata?.cite2c?.citations;
  // parse biobliographic elements
  if (citationsFromMetadata instanceof Object) {
    bibliography = new Cite(Object.values(citationsFromMetadata))
  }
  console.info('getArticleTreeFromIpynb', citationsFromMetadata)
  // this contain footnotes => zotero id to remap reference at paragraph level
  const referenceIndex = {}
  let paragraphNumber = 0
  cells.map((cell, idx) => {
    const citation = cell.source.join('\n\n').match(/<span id=.fn(\d+).><cite data-cite=.([/\dA-Z]+).>/)
    if(citation) {
      referenceIndex[citation[1]] = citation[2]
      cell.hidden = true
    }
    return cell
  }).forEach((cell, idx) => {
    // console.info(p.cell_type, idx)
    if (cell.cell_type === 'markdown') {
      const sources = cell.source.join('\n\n')
      // exclude rendering of reference references
      const tokens = markdownParser.parse(sources);
      const {content, references} = renderMarkdownWithReferences({
        sources,
        referenceIndex,
        citationsFromMetadata,
      })

      // get tokens 'heading_open' to get all h1,h2,h3 etc...
      const headerIdx = tokens.findIndex(t => t.type === 'heading_open');
      if (headerIdx > -1) {
        headings.push(new ArticleHeading({
          tag: tokens[headerIdx].tag,
          content: tokens[headerIdx + 1].content,
          idx
        }))
      } else if (typeof cell.metadata.jdh?.section === "undefined" ){
        paragraphNumber += 1
      }
      paragraphs.push(new ArticleCell({
        type: 'markdown',
        content,
        source: cell.source,
        metadata: cell.metadata,
        idx,
        num: headerIdx > -1 ? -1 : paragraphNumber,
        references,
        hidden: !!cell.hidden,
        level: headerIdx > -1 ? tokens[headerIdx].tag : 'p'
      }))
    } else if (cell.cell_type === 'code') {
      paragraphNumber += 1
      paragraphs.push(new ArticleCell({
        type: 'code',
        content: cell.source.join(''),
        source: cell.source,
        metadata: cell.metadata,
        idx,
        num: paragraphNumber,
        outputs: cell.outputs,
        level: 'code'
      }))
    }
  })
  return new ArticleTree({ headings, paragraphs, bibliography })
}

export {
  markdownParser,
  getArticleTreeFromIpynb
}

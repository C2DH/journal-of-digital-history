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
  // this contain footnotes => zotero id to remap reference at paragraph level
  const referenceIndex = {}
  const paragraphNumbers = {}
  cells.map((cell, idx) => {
    const citation = cell.source.join('\n\n').match(/<span id=.fn(\d+).><cite data-cite=.([/\dA-Z]+).>/)
    if (citation) {
      referenceIndex[citation[1]] = citation[2]
      cell.hidden = true
      cell.layer = 'citation'
    } else {
      // add paragraph number and layer information based on "layer", if any provided (default to 'narrative').
      // section is mostly used to host article metadata, such as authors, title or keywords.
      // maybe add layer "metadata"? for the moment, we assume sections is layer metadata.
      // layer can be "hermeneutics", "data" or none (assume "narrative" by default)
      // this should be enough for multilayered articles.
      // we exclude hidden cells anyway.
      if (['hermeneutics', 'data', 'narrative', 'metadata'].includes(cell.metadata.jdh?.layer)) {
        cell.layer = cell.metadata.jdh.layer
      } else if (cell.metadata.jdh?.section) {
        cell.layer = 'metadata'
      } else {
        cell.layer = 'narrative'
      }
    }
    if (!paragraphNumbers[cell.layer]) {
      paragraphNumbers[cell.layer] = 0
    }
    cell.num = paragraphNumbers[cell.layer] += 1
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
      }
      paragraphs.push(new ArticleCell({
        type: 'markdown',
        content,
        source: cell.source,
        metadata: cell.metadata,
        layer: cell.layer,
        idx,
        num: cell.num,
        references,
        hidden: !!cell.hidden,
        level: headerIdx > -1 ? tokens[headerIdx].tag : 'p'
      }))
    } else if (cell.cell_type === 'code') {
      paragraphs.push(new ArticleCell({
        type: 'code',
        content: cell.source.join(''),
        source: cell.source,
        metadata: cell.metadata,
        idx,
        num: cell.num,
        outputs: cell.outputs,
        level: 'code'
      }))
    }
  })
  // console.info('getArticleTreeFromIpynb', citationsFromMetadata, headings, paragraphs, bibliography)
  console.info('getArticleTreeFromIpynb paragraphs:', paragraphs, 'numbers:',paragraphNumbers)
  return new ArticleTree({ headings, paragraphs, bibliography })
}

const getStepsFromMetadata = ({ metadata }) => {
  return (metadata.jdh.steps ?? []).map(step => ({
    ...step,
    content: markdownParser.render(step.source.join('\n'))
  }))
}

export {
  markdownParser,
  getArticleTreeFromIpynb,
  getStepsFromMetadata
}

import MarkdownIt from 'markdown-it'
import Cite from 'citation-js'
import MarkdownItAttrs from '@gerhobbelt/markdown-it-attrs'

import ArticleTree from '../models/ArticleTree'
import ArticleHeading from '../models/ArticleHeading'
import ArticleCell from '../models/ArticleCell'
import ArticleReference from '../models/ArticleReference'

import {
  LayerChoices, SectionChoices,
  LayerNarrativeData, LayerNarrative, LayerData,
  LayerHidden, LayerCitation, LayerMetadata
} from '../constants'

const encodeNotebookURL = (url) => btoa(encodeURIComponent(url))
const decodeNotebookURL = (encodedUrl) => decodeURIComponent(atob(encodedUrl))

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
  console.info('markdownParser.render', markdownParser.render(sources))
  const content = markdownParser.render(sources)
    // just Reference, like in this sentence:
    //&lt;cite data-cite=“4583/B7B2APU6”&gt;&lt;/cite&gt;, p. 146).
    // "Compiling a collection of tweets of this nature raises considerable methodological issues.
    // While we will not go into detail, we would refer our readers to previous publications
    // that touches on these subjects <cite data-cite="7009778/GBFQ2FF7"></cite>."
    .replace(/&lt;cite\s+data-cite=.([/\dA-Z]+).&gt;&lt;\/cite&gt;/g, (m, id) => {
      const reference = new ArticleReference({
        ref: citationsFromMetadata[id],
      })
      references.push(reference)
      return `
        <span class="ArticleReference d-inline-block">
        <span class=" d-inline-block">
          <span class="ArticleReference_shortRef">${reference.shortRef}</span>
        </span>
        </span>`
    })
    // look for footnotes
    .replace(/&lt;sup&gt;(\d+)&lt;\/sup&gt;/g, (m, num) => {
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
          <span class="ArticleReference_shortRef">${reference.shortRef}</span>
        </span>
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
    const sources = Array.isArray(cell.source)
      ? cell.source.join('\n\n')
      : cell.source
    // "Compiling a collection of tweets of this nature raises considerable methodological issues.
    // While we will not go into detail, we would refer our readers to previous publications
    // that touches on these subjects <cite data-cite="7009778/GBFQ2FF7"></cite>."
    const footnote = sources.match(/<span id=.fn(\d+).><cite data-cite=.([/\dA-Z]+).>/)
    // const citation = sources.match(/<cite data-cite=.([/\dA-Z]+).>/)
    if (cell.metadata.jdh?.hidden) {
      cell.hidden = true
      cell.layer = LayerHidden
    } else if (footnote) {
      referenceIndex[footnote[1]] = footnote[2]
      cell.hidden = true
      cell.layer = LayerCitation
    } else if (idx < cells.length && cell.cell_type === 'code' && Array.isArray(cell.outputs)) {
        // check whether ths cell outputs JDH metadata containing **module**;
        const cellOutputJdhMetadata = cell.outputs.find(d => d.metadata?.jdh?.module)
        if (cellOutputJdhMetadata) {
          // if yes, these metadata AND its output will be added to this cell.
          cell.metadata = {
            ...cell.metadata,
            jdh: {
              ...cell.metadata.jdh,
              ...cellOutputJdhMetadata.metadata.jdh,
              ref: idx,
              outputs: cell.outputs
            }
          }
          // cell.hidden = true
          // cell.layer = 'citation'
        cell.layer = LayerNarrativeData
      } else {
        cell.layer = LayerData
      }
    } else if(SectionChoices.includes(cell.metadata.jdh?.section)) {
      cell.layer = LayerMetadata
      // section is mostly used to host article metadata, such as authors, title or keywords.
      cell.section = cell.metadata.jdh?.section
    } else {
      if (LayerChoices.includes(cell.metadata.jdh?.layer)) {
        cell.layer = cell.metadata.jdh.layer
      } else {
        cell.layer = LayerNarrative
      }
    }
    if (!paragraphNumbers[cell.layer]) {
      paragraphNumbers[cell.layer] = 0
    }
    cell.num = paragraphNumbers[cell.layer] += 1
    cell.source = Array.isArray(cell.source)
      ? cell.source
      : [cell.source]
    return cell
  }).forEach((cell, idx) => {
    // console.info(p.cell_type, idx)
    if (cell.cell_type === 'markdown') {
      const sources = cell.source.join('  \n')
      // exclude rendering of reference references
      const tokens = markdownParser.parse(sources);
      const {content, references} = renderMarkdownWithReferences({
        sources,
        referenceIndex,
        citationsFromMetadata,
      })
      // TODO: render paragraphs in metadata too!
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
        section: cell.section,
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
        section: cell.section,
        source: cell.source,
        metadata: cell.metadata,
        layer: cell.layer,
        idx,
        num: cell.num,
        outputs: cell.outputs,
        hidden: !!cell.hidden,
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

const getParsedSteps = ({ steps }) => steps.map(step => ({
  ...step,
  content: markdownParser.render(step.source.join('  \n'))
}))

export {
  markdownParser,
  getParsedSteps,
  getArticleTreeFromIpynb,
  getStepsFromMetadata,
  encodeNotebookURL,
  decodeNotebookURL
}

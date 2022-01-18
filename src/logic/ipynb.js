import MarkdownIt from 'markdown-it'
import Cite from 'citation-js'
import MarkdownItAttrs from '@gerhobbelt/markdown-it-attrs'
import MarkdownItMathjax from 'markdown-it-mathjax3'
// import { groupBy } from 'lodash'
import ArticleTree from '../models/ArticleTree'
import ArticleHeading from '../models/ArticleHeading'
import ArticleCell from '../models/ArticleCell'
// import ArticleCellGroup from '../models/ArticleCellGroup'
import ArticleReference from '../models/ArticleReference'
import ArticleFigure from '../models/ArticleFigure'
import ArticleAnchor from '../models/ArticleAnchor'
import {
  SectionChoices, SectionDefault,
  LayerChoices, LayerNarrative, // LayerHermeneuticsStep,
  RoleHidden, RoleFigure, RoleMetadata, RoleCitation, RoleDefault, RoleQuote,
  CellTypeMarkdown, CellTypeCode,
  FigureRefPrefix,
  TableRefPrefix,
  CoverRefPrefix,
  QuoteRefPrefix,
  AnchorRefPrefix
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
  allowedAttributes: ['class', 'id']  // empty array = all attributes are allowed
});
markdownParser.use(MarkdownItMathjax)

const renderMarkdownWithReferences = ({
  sources = '',
  referenceIndex = {},
  citationsFromMetadata = {},
  figures = [],
  anchors = []
}) => {
  const references = []
  // console.info('markdownParser.render', markdownParser.render(sources))
  const content = markdownParser.render(sources)
    .replace(/&lt;a[^&]*&gt;(.*)&lt;\/a&gt;/g, '')
    // replace links "figure-" add data-idx attribute containing a figure id
    .replace(/<a href="#((figure|table|anchor)-[^"]+)">/g, (m, anchorRef) => {
      const ref = anchorRef.indexOf('anchor-') !== -1
        ? anchors.find(d => d.ref === anchorRef)
        : figures.find(d => d.ref === anchorRef)
      if (ref) {
        return `<a href="#${anchorRef}" data-idx="${ref.idx}" data-ref-type="${ref.type}">`
      }
      return `<a href="#${anchorRef}" data-idx-notfound>`
    })
    // replace sup
    .replace(/&lt;sup&gt;(.*)&lt;\/sup&gt;/g, (m, str) => `<sup>${str}</sup>`)
    // find and replace ciation in Chicago author-date style, like in this sentence:
    // "Compiling a collection of tweets of this nature raises considerable methodological issues.
    // While we will not go into detail, we would refer our readers to previous publications
    // that touches on these subjects <cite data-cite="7009778/GBFQ2FF7"></cite>."
    // Cfr. https://www.scribbr.com/chicago-style/author-date/ (consulted 2021-03-08)
    //&lt;cite data-cite=“4583/B7B2APU6”&gt;&lt;/cite&gt;, p. 146).
    // "Compiling a collection of tweets of this nature raises considerable methodological issues.
    // While we will not go into detail, we would refer our readers to previous publications
    // that touches on these subjects <cite data-cite="7009778/GBFQ2FF7"></cite>."
    .replace(/&lt;cite\s+data-cite=.([/\dA-Z]+).&gt;&lt;\/cite&gt;/g, (m, id) => {
      const reference = new ArticleReference({
        ref: citationsFromMetadata[id],
      })
      references.push(reference)
      return `<span class="ArticleReference d-inline-block">
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

/**
 * getFirstValidMatchFromChoices
 *
 * This funciton return one and only one valid choice (scalar value) given a list of `choices`
 * and a list of possible candidates (scalar values only)
 *
 * @param {Object} candidates - list of strings, numbers etc..
 * @param {Array} choices - list of possible valid outputs
 * @param {Array} defaultChoice - optional. Section default choice
 * @return {Number|String} - Return one and only one valid value among the choices or the defaultChoice
*/
const getFirstValidMatchFromChoices = (candidates=[], choiches=[], defaultChoice=null) => {
  for (let i=0; i < candidates.length; i++) {
    if (choiches.includes(candidates[i])) {
      return candidates[i]
    }
  }
  return defaultChoice
}
/**
 * getSectionFromCellMetadata
 *
 * This funciton returns one and only one valid section given a list of `choices`.
 * Cell tags are parsed, but also jdh special metadata section. The
 * jdh.section idea is taken from [ipypublish](https://ipypublish.readthedocs.io/en/latest/metadata_tags.html)
 *
 * @param {Object} metadata - Notebook cell metadata object
 * @return {null|String} - Return one and only one valid section or undefined
*/
const getSectionFromCellMetadata = (metadata) => getFirstValidMatchFromChoices(
  [].concat(metadata.tags, metadata.jdh?.section),
  SectionChoices, SectionDefault
)
/**
 * getLayerFromCellMetadata
 *
 * This funciton returns one and only one valid `layer` from the list of `LayerChoices`.
 * Cell tags are parsed, but also jdh special metadata layer. The
 * jdh.layer idea is taken from [ipypublish](https://ipypublish.readthedocs.io/en/latest/metadata_tags.html)
 *
 * @param {Object} metadata - Notebook cell metadata object
 * @return {null|String} - Return one and only one valid section or undefined
*/
const getLayerFromCellMetadata = (metadata) => getFirstValidMatchFromChoices(
  [].concat(metadata.tags, metadata.jdh?.layer),
  LayerChoices, LayerNarrative
)

const getArticleTreeFromIpynb = ({ id, cells=[], metadata={} }) => {
  const headings = []
  const headingsPositions = []
  const figures = []
  const articleCells = []
  const articleParagraphs = []
  const anchors = []
  const sectionsIndex = {}
  let citationsFromMetadata = metadata?.cite2c?.citations

  if (citationsFromMetadata) {
    // if one of the key is named "udefined" (sic)
    if (citationsFromMetadata.undefined) {
      delete citationsFromMetadata.undefined
    }
    // add property issued to correct Cite library bug on date-parts
    citationsFromMetadata = Object.values(citationsFromMetadata).reduce((acc, d) => {
      if (typeof d.issued === 'object' && d.issued.year && !d.issued['date-parts']) {
        acc[d.id] = {
          ...d,
          issued: {
            ...d.issued,
            ['date-parts']: [[d.issued.year]]
          }
        }
      } else {
        acc[d.id] = d
      }
      return acc
    }, {})
  }
  // this contain footnotes => zotero id to remap reference at paragraph level
  const referenceIndex = {}
  //
  let bibliography = null
  // parse biobliographic elements
  if (citationsFromMetadata instanceof Object) {
    bibliography = new Cite(Object.values(citationsFromMetadata).filter(d => d))
  }
  let paragraphNumber = 0
  // cycle through notebook cells to fill ArticleCells, figures, headings
  cells.map((cell, idx) => {
    const sources = Array.isArray(cell.source)
      ? cell.source.join('\n')
      : cell.source
    // find footnote citations (with the number)
    const footnote = sources.match(/<span id=.fn(\d+).><cite data-cite=.([/\dA-Z]+).>/)
    const coverRef = cell.metadata.tags?.find(d => d.indexOf(CoverRefPrefix) === 0)
    const figureRef = cell.metadata.tags?.find(d => d.indexOf(FigureRefPrefix) === 0)
    const tableRef = cell.metadata.tags?.find(d => d.indexOf(TableRefPrefix) === 0)
    const quoteRef = cell.metadata.tags?.find(d => d.indexOf(QuoteRefPrefix) === 0)
    const anchorRef = cell.metadata.tags?.find(d => d.indexOf(AnchorRefPrefix) === 0)
    // get section and layer from metadata
    cell.section = getSectionFromCellMetadata(cell.metadata)
    cell.layer = getLayerFromCellMetadata(cell.metadata)
    cell.role = RoleDefault
    // get role in a secont step
    if (sources.length === 0 || cell.metadata.tags?.includes('hidden') || cell.metadata.jdh?.hidden) {
      // is hidden (e.g. uninteresting code, like pip install)
      cell.hidden = true
      cell.role = RoleHidden
    } else if (footnote) {
      // it is a footnote cell given by Cite2c
      referenceIndex[footnote[1]] = footnote[2]
      cell.hidden = true
      cell.role = RoleCitation
    } else if (figureRef) {
      // this is a proper figure, nothing to say about it.
      figures.push(new ArticleFigure({ ref: figureRef, idx }))
      cell.role = RoleFigure
    } else if (coverRef) {
      figures.push(new ArticleFigure({ ref: coverRef, idx, isCover:true }))
      cell.role = RoleFigure
    } else if (tableRef) {
      // this is a proper figure, nothing to say about it.
      figures.push(new ArticleFigure({ ref: tableRef, idx, isTable: true }))
      cell.role = RoleFigure
    } else if (quoteRef) {
      cell.role = RoleQuote
    } else if (idx < cells.length && cell.cell_type === 'code' && Array.isArray(cell.outputs) && cell.outputs.length) {
      // this is a "Figure" candindate.
      // Let's check whether the cell outputs JDH metadata and if jdh namespace contains **module**;
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
        figures.push(new ArticleFigure({
          module: cell.metadata.jdh.module,
          type: cell.metadata.jdh.object?.type,
          idx,
          num: figures.length + 1
        }))
        cell.role = RoleFigure
      }
      // this is not a real "Figure", just a "Data..."
    } else if (cell.section !== SectionDefault) {
      cell.role = RoleMetadata
    }
    if (anchorRef) {
      anchors.push(new ArticleAnchor({ ref: anchorRef, idx }))
    }
    cell.source = Array.isArray(cell.source)
      ? cell.source
      : [cell.source]
    paragraphNumber += 1
    cell.num = paragraphNumber
    return cell
  }).forEach((cell, idx) => {
    // console.info('ipynb', cell.role, cell.num)
    if (cell.cell_type === CellTypeMarkdown) {
      const sources = cell.source.join('')
      // exclude rendering of reference references
      let tokens = []
      try {
        tokens = markdownParser.parse(sources);
      } catch(err) {
        console.warn('Couldn\'t parse cell markdown tokens', cell, err)
      }
      const {content, references} = renderMarkdownWithReferences({
        sources,
        referenceIndex,
        citationsFromMetadata,
        figures,
        anchors
      })
      // get tokens 'heading_open' to get the first h1,h2,h3 in source.
      const headerIdx = tokens.findIndex(t => t.type === 'heading_open');
      if (headerIdx > -1) {
        // We used to get heading content from the next token, as this is the
        // first element after the heading_open.
        // If it has only one child, everything works as expected:
        // we can safely get its plain text from the `content` property as it is
        // a text node (DOM).
        // However, sometimes authors want to put emphasised text in their
        // heading. For instance, the sentence:
        //
        //     "Quantifying the *epigraphic habit*, in space and time"
        //
        // is composed of 5 children:
        //
        //     [text]     "Quantifying the ",
        //     [em_open]  "",
        //     [text]     "epigraphic habit",
        //     [em_close] "",
        //     [text]     ", in space and time"
        //
        // Hence, if we want to have only the plain text content,
        // we have to join the content of the children of the next token...
        const headingContent = tokens[headerIdx + 1].children
          .map(d => d.content)
          .join('')

        headings.push(new ArticleHeading({
          level: parseInt(tokens[headerIdx].tag.replace(/[^\d]/, '')),
          tag: tokens[headerIdx].tag,
          content: headingContent,
          idx
        }))
      }
      if(headerIdx > -1 || cell.role === RoleFigure) {
        headingsPositions.push(idx)
      }
      articleCells.push(new ArticleCell({
        type: CellTypeMarkdown,
        content,
        source: cell.source,
        section: cell.section,
        metadata: cell.metadata,
        layer: cell.layer,
        role: cell.role,
        idx,
        num: cell.num,
        references,
        hidden: !!cell.hidden,
        heading: headerIdx > -1
          ? headings[headings.length - 1]
          : null,
        level: headerIdx > -1
          ? tokens[headerIdx].tag
          : 'p',
        figure: cell.role === RoleFigure
          ? figures.find((d) => d.idx === idx)
          : null
      }))
    } else if (cell.cell_type === CellTypeCode) {
      articleCells.push(new ArticleCell({
        type: CellTypeCode,
        content: cell.source.join(''),
        section: cell.section,
        source: cell.source,
        metadata: cell.metadata,
        role: cell.role,
        layer: cell.layer,
        idx,
        num: cell.num,
        outputs: cell.outputs,
        hidden: !!cell.hidden,
        level: 'code',
        figure: cell.role === RoleFigure
          ? figures.find((d) => d.idx === idx)
          : null
      }))
      if(cell.role === RoleFigure) {
        headingsPositions.push(idx)
      }
    }
  })
  for (let i = 0; i < articleCells.length; i+=1) {
    // add cell to section (for role Metadata)
    if (!sectionsIndex[articleCells[i].section]) {
      sectionsIndex[articleCells[i].section] = []
    }
    sectionsIndex[articleCells[i].section].push(articleCells[i])
    if (articleCells[i].section === SectionDefault) {
      articleParagraphs.push(articleCells[i])
    }
  }
  // used locally
  // let bufferCellsGroup = new ArticleCellGroup()
  // for (let i = 0; i < articleCells.length; i+=1) {
  //   // add reference
  //   if (!sectionsIndex[articleCells[i].section]) {
  //     sectionsIndex[articleCells[i].section] = []
  //   }
  //   sectionsIndex[articleCells[i].section].push(articleCells[i])
  //   // get groups by role or layer
  //   if (articleCells[i].layer === LayerHermeneuticsStep) {
  //     bufferCellsGroup.addArticleCell(articleCells[i])
  //   } else {
  //     if (bufferCellsGroup.cells.length) {
  //       // add this group to paragraphs
  //       articleParagraphs.push(bufferCellsGroup)
  //       bufferCellsGroup = new ArticleCellGroup()
  //     }
  //     if (articleCells[i].section === SectionDefault) {
  //       articleParagraphs.push(articleCells[i])
  //     }
  //   }
  // }
  // if (bufferCellsGroup.cells.length) {
  //   articleParagraphs.push(bufferCellsGroup)
  // }
  return new ArticleTree({
    id,
    headings,
    headingsPositions,
    cells: articleCells,
    paragraphs: articleParagraphs,
    paragraphsPositions: articleParagraphs.map(d => d.idx),
    sections: sectionsIndex,
    bibliography, figures, anchors,
    citationsFromMetadata
  })
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

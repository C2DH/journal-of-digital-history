import { Cite } from '@citation-js/core'
import { markdownParser } from './markdown'

import ArticleTree from '../models/ArticleTree'
import ArticleHeading from '../models/ArticleHeading'
import ArticleCell from '../models/ArticleCell'

import ArticleReference from '../models/ArticleReference'
import {
  SectionDefault,
  RoleHidden,
  RoleFigure,
  RoleMetadata,
  RoleCitation,
  RoleDefault,
  CellTypeMarkdown,
  CellTypeCode,
  AnchorRefPrefix,
  AvailableRefPrefixes,
  AvailableFigureRefPrefixes,
  DialogRefPrefix,
} from '../constants/globalConstants'
import ArticleTreeWarning, {
  FigureAnchorWarningCode,
  MarkdownParserWarningCode,
  ReferenceWarningCode,
} from '../models/ArticleTreeWarning'

import {
  getSectionFromCellMetadata,
  getLayerFromCellMetadata,
  getFigureFromCell,
  getAnchorFromCell,
} from './utils'

const encodeNotebookURL = (url) => btoa(encodeURIComponent(url))
const decodeNotebookURL = (encodedUrl) => decodeURIComponent(atob(encodedUrl))

const renderMarkdownWithReferences = ({
  idx = -1,
  sources = '',
  referenceIndex = {},
  citationsFromMetadata = {},
  figures = [],
  anchors = [],
  figure = null, // ArticleFigure instance if any, null otherwise
}) => {
  const references = []
  const warnings = []
  const prefixRegex = new RegExp(
    '<a href="#((' + AvailableRefPrefixes.join('|') + ')[^"]+-*)">([^<]+)</a>',
    'ig',
  )
  const citeToRef = (m, id0, id1, label) => {
    const id = `${id0}/${id1}`

    const reference = new ArticleReference({
      ref: citationsFromMetadata[id],
    })
    let shortRef = ''
    if (!citationsFromMetadata[id]) {
      warnings.push(
        new ArticleTreeWarning({
          idx,
          code: ReferenceWarningCode,
          message: `missing citation id ${id} in notebook metadata`,
          context: id,
        }),
      )
      shortRef = label.replace(/[()]/g, '')
    } else {
      shortRef = reference.shortRefText
    }
    console.info(
      '[ipynb.renderMarkdownWithReferences] citeToRef',
      idx,
      id,
      label,
      citationsFromMetadata[id],
      '\n our shortRef:',
      reference.shortRefText,
    )
    references.push(reference)
    return `<span class="ArticleReference d-inline-block">
      <span class=" d-inline-block">
        <span class="ArticleReference_shortRef">
          <span data-href="${id}"><span class="ArticleReference_pointer"></span>
          ${shortRef}
          </span>
        </span>
      </span>
      </span>`
  }

  let content = markdownParser.render(sources)
  console.info('[ipynb] rendered content', idx, content)
  content = content
    // enable <br />
    .replace(/&lt;br\/&gt;/g, '<br/>')
    .replace(/&lt;br&gt;/g, '<br/>')
    .replace(/&lt;i&gt;/g, '<i>')
    .replace(/&lt;\/i&gt;/g, '</i>')
    // Note: this is for cite2c migrating to citation manager :(
    // In content we have smt like
    // &lt;cite id=“cite2c-7748027/DJM2S2R7”&gt;&lt;a href=“#cite2c%7C7748027%2FDJM2S2R7”&gt;(Salomon, 2021)&lt;/a&gt;&lt;/cite&gt;
    //
    // &lt;cite id=“cite2c-7748027/C6Q3NJHF”&gt;(Karasch, 1987)&lt;/cite&gt;:60, &lt;cite id=“cite2c-7748027/E4NNMKER”&gt;(Linhares et Lévy, 1971)&lt;/cite&gt;:129
    .replace(
      /&lt;cite id=.cite2c-([\dA-Z]+)\/([\dA-Z]+).&gt;&lt;a href=.#cite2c%..[\dA-Z%]+.&gt;(.+?)&lt;\/a&gt;&lt;\/cite&gt;/gm,
      citeToRef,
    )
    .replace(/&lt;cite id=.cite2c-([\dA-Z]+)\/([\dA-Z]+).&gt;(.+?)&lt;\/cite&gt;/gm, citeToRef)
    // Note: this is for citationManager.
    // E.g. &lt;cite id=“arpnc”&gt;&lt;a href=“#zotero%7C8918850%2F6BZTRQWI”&gt;(Coughenour et al., 2015)&lt;/a&gt;&lt;/cite&gt;
    .replace(
      /&lt;cite\s+[^&]+&gt;&lt;a\s+href=.#zotero%..([\dA-Z]+)%..([\dA-Z]+).&gt;(.+?)&lt;\/a&gt;&lt;\/cite&gt;/gm,
      citeToRef,
    )
    // add target blank for all external links
    .replace(/<a href="([^"]+)"/g, (m, href) => {
      if (href.indexOf('http') === 0) {
        return `<a target="_blank" href="${href}"`
      }
      return m
    })
    .replace(/&lt;a[^&]*&gt;(.*)&lt;\/a&gt;/g, '')
    // replace links "figure-*" or anchors ending with automatic numbering syntax. Debug using:
    // console.debug(
    //   'PREFIEXREGEX',
    //   prefixRegex,
    //   '\n localRef:',
    //   localRef,
    //   '\n content:',
    //   content,
    //   '\n isAnchor:',
    //   isAnchor,
    //   '\n anchors:',
    //   anchors,
    //   figures,
    //   '\n ref:',
    // )
    .replace(prefixRegex, (m, localRef, c, content) => {
      const isAnchor = localRef.indexOf(AnchorRefPrefix) !== -1
      const ref = isAnchor
        ? anchors.find((d) => d.ref === localRef || d.ref === `${localRef}-*`)
        : figures.find((d) => d.ref === localRef || d.ref === `${localRef}-*`)
      if (!ref) {
        console.error(
          'REF NOT FOUND in either list of anchors or figures',
          '\n - localRef:',
          localRef,
          '\n - isAnchor:',
          isAnchor,
          '\n - anchors available:',
          anchors,
          '\n - content:',
          content,
        )
        warnings.push(
          new ArticleTreeWarning({
            idx,
            code: FigureAnchorWarningCode,
            message: `missing figure for ref "${localRef}" in notebook metadata`,
            context: localRef,
          }),
        )
        return `<a data-idx-notfound class="bg-danger" href="#${localRef}">${content}</a>`
      }
      if (isAnchor) {
        return `<a data-idx="${ref.idx}" href="#${localRef}">${content}</a>`
      }
      // isFigure
      return `<a data-idx="${ref.idx}" href="#${localRef}" data-ref-type="${ref.type}">figure ${ref.num}</a>`
    })
    // sometimes there are plain links
    .replace(
      /<a href="(#|@)((figure|table|anchor)-[^"]+)">(.*)<\/a>/g,
      (m, hashSymbol, localRef, content) => {
        const isAnchor = localRef.indexOf(AnchorRefPrefix) !== -1
        const ref = isAnchor
          ? anchors.find((d) => d.ref === localRef || d.ref === `${localRef}-*`)
          : figures.find((d) => d.ref === localRef || d.ref === `${localRef}-*`)
        console.debug(
          'PLAIN LINKS ANCHOR OR FIGURES',

          '\n localRef:',
          localRef,
          '\n content:',
          content,
          '\n isAnchor:',
          isAnchor,
          '\n anchors:',
          anchors,
          figures,
          '\n ref:',
          ref,
        )
        if (ref) {
          if (isAnchor) {
            return `<a href="#${localRef}" data-idx="${ref.idx}" data-ref-type="${ref.type}">${content}</a>`
          }
          return `<a href="#${localRef}" data-idx="${ref.idx}" data-ref-type="${ref.type}">figure ${ref.num}</a>`
        }
        console.error(
          'REF NOT FOUND in either list of anchors or figures',
          '\n - localRef:',
          localRef,
          '\n - isAnchor:',
          isAnchor,
          '\n - anchors available:',
          anchors,
          '\n - content:',
          content,
        )
        warnings.push(
          new ArticleTreeWarning({
            idx,
            code: FigureAnchorWarningCode,
            message: `missing anchor or figure for ref "${localRef}" in notebook metadata`,
            context: localRef,
          }),
        )
        return `<a href="#${localRef}" data-idx-notfound>${content}</a>`
      },
    )
    // replace sup
    .replace(/&lt;sup&gt;(.*)&lt;\/sup&gt;/g, (m, str) => `<sup>${str}</sup>`)

    // Note: this is for cite2c. find and replace ciation in Chicago author-date style, like in this sentence:
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
      if (!citationsFromMetadata[id]) {
        warnings.push(
          new ArticleTreeWarning({
            idx,
            code: ReferenceWarningCode,
            message: `missing citation id ${id} in notebook metadata`,
            context: id,
          }),
        )
      }
      references.push(reference)
      return `<span class="ArticleReference d-inline-block">
        <span class=" d-inline-block">
          <span class="ArticleReference_shortRef">${reference.shortRef || '[' + id + ']'}</span>
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
  // add specific replacement for specific figure RefPrefix
  if (figure?.refPrefix === DialogRefPrefix) {
    // eslint-disable-next-line
    content = content
      .replace(/<td>\s*<\/td>/g, '<td class="empty"></td>')
      .replace(/<td>\s*&nbsp;\s*<\/td>/g, '<td class="empty"></td>')
      .replace(/<td>(.*)<\/td>/g, '<td><div>$1</div></td>')
  }

  return { content, references, warnings }
}

const getArticleTreeFromIpynb = ({ id, cells = [], metadata = {} }) => {
  const headings = []
  const headingsPositions = []
  const figures = []
  const articleCells = []
  const articleParagraphs = []
  const anchors = []
  const sectionsIndex = {}
  const warnings = []
  // this contain footnotes => zotero id to remap reference at paragraph level
  const referenceIndex = {}
  let bibliography = null
  // deprecation notice: cite2c is only being used in jupyter notebooks 6.0.0 and below
  let citationsFromMetadata =
    metadata.cite2c?.citations ||
    metadata['citation-manager']?.items?.zotero ||
    metadata['citation-manager']?.items?.cite2c
  console.info('[ipynb]', id, metadata, citationsFromMetadata)
  // initialize figure numbering using constants/AvailableFigureRefPrefixes
  const figureNumberingByRefPrefix = AvailableFigureRefPrefixes.reduce((acc, prefix) => {
    acc[prefix] = 0
    return acc
  }, {})
  let paragraphNumber = 0
  // parse citations
  if (citationsFromMetadata) {
    // if one of the key is named "udefined" (sic)
    if (citationsFromMetadata.undefined) {
      delete citationsFromMetadata.undefined
    }
    // add property issued to correct Cite library bug on date-parts
    citationsFromMetadata = Object.keys(citationsFromMetadata).reduce((acc, k) => {
      const d = citationsFromMetadata[k]
      if (!d.id) {
        d.id = k
      }
      if (typeof d.issued === 'object' && d.issued.year && !d.issued['date-parts']) {
        acc[d.id] = {
          ...d,
          issued: {
            ...d.issued,
            ['date-parts']: [[d.issued.year]],
          },
        }
      } else {
        acc[d.id] = d
      }
      return acc
    }, {})
  }
  // parse bibliographic elements
  if (citationsFromMetadata instanceof Object) {
    bibliography = new Cite(Object.values(citationsFromMetadata).filter((d) => d))
  }

  // cycle through notebook cells to fill ArticleCells, figures, headings
  cells
    .map((cell, idx) => {
      cell.idx = idx
      // get section and layer from cell metadata
      cell.section = getSectionFromCellMetadata(cell.metadata)
      cell.layer = getLayerFromCellMetadata(cell.metadata)
      cell.role = RoleDefault

      const sources = Array.isArray(cell.source) ? cell.source.join('\n') : cell.source
      console.info('[ipynb]', cell.idx, sources)
      // find footnote citations (with the number)
      const footnote = sources.match(/<span id=.fn(\d+).><cite data-cite=.([/\dA-Z]+).>/)
      const figure = getFigureFromCell(cell, AvailableFigureRefPrefixes)
      const anchor = getAnchorFromCell(cell, [AnchorRefPrefix])
      const isHidden =
        sources.length === 0 || cell.metadata.tags?.includes('hidden') || cell.metadata.jdh?.hidden

      if (anchor) {
        cell.anchor = anchor
        anchors.push(anchor)
      }
      if (figure) {
        // update global index of figure numbering for this specific prefix and forward it to the figure
        figureNumberingByRefPrefix[figure.refPrefix] += 1
        figure.setNum(+figureNumberingByRefPrefix[figure.refPrefix])
        figures.push(figure)
        cell.figure = figure
        cell.role = RoleFigure
      } else if (isHidden) {
        // is hidden (e.g. uninteresting code, like pip install)
        cell.hidden = true
        cell.role = RoleHidden
      } else if (footnote) {
        // it is a footnote cell given by Cite2c
        referenceIndex[footnote[1]] = footnote[2]
        cell.hidden = true
        cell.role = RoleCitation
      } else if (cell.section !== SectionDefault) {
        cell.role = RoleMetadata
      }

      cell.source = Array.isArray(cell.source) ? cell.source : [cell.source]
      if (cell.role !== RoleMetadata) {
        paragraphNumber += 1
        cell.num = paragraphNumber
      }
      return cell
    })
    .forEach((cell, idx) => {
      // console.info('ipynb', cell.role, cell.num)
      if (cell.cell_type === CellTypeMarkdown) {
        const sources = cell.source.join('')
        // exclude rendering of reference references
        let tokens = []
        try {
          tokens = markdownParser.parse(sources)
        } catch (err) {
          warnings.push(
            new ArticleTreeWarning({
              idx,
              code: MarkdownParserWarningCode,
              message: err.message,
              error: err,
            }),
          )
        }
        const {
          content,
          references,
          warnings: postRenderWarnings = [],
        } = renderMarkdownWithReferences({
          idx,
          sources,
          referenceIndex,
          citationsFromMetadata,
          figures,
          anchors,
          figure: cell.figure,
        })
        if (postRenderWarnings.length) {
          warnings.push(...postRenderWarnings)
        }
        // get tokens 'heading_open' to get the first h1,h2,h3 in source.
        const headerIdx = tokens.findIndex((t) => t.type === 'heading_open')
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
          const headingContent = tokens[headerIdx + 1].children.map((d) => d.content).join('')

          headings.push(
            new ArticleHeading({
              level: parseInt(tokens[headerIdx].tag.replace(/[^\d]/, '')),
              tag: tokens[headerIdx].tag,
              content: headingContent,
              idx,
            }),
          )
        }
        if (headerIdx > -1 || cell.role === RoleFigure) {
          headingsPositions.push(idx)
        }
        articleCells.push(
          new ArticleCell({
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
            heading: headerIdx > -1 ? headings[headings.length - 1] : null,
            level: headerIdx > -1 ? tokens[headerIdx].tag : 'p',
            figure: cell.figure,
            anchor: cell.anchor,
          }),
        ) 
      } else if (cell.cell_type === CellTypeCode) {
        articleCells.push(
          new ArticleCell({
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
            figure: cell.role === RoleFigure ? figures.find((d) => d.idx === idx) : null,
          }),
        )
        if (cell.role === RoleFigure) {
          headingsPositions.push(idx)
        }
      }
    })
  for (let i = 0; i < articleCells.length; i += 1) {
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
    paragraphsPositions: articleParagraphs.map((d) => d.idx),
    sections: sectionsIndex,
    bibliography,
    figures,
    anchors,
    citationsFromMetadata,
    warnings,
  })
}

const getStepsFromMetadata = ({ metadata }) => {
  return (metadata.jdh.steps ?? []).map((step) => ({
    ...step,
    content: markdownParser.render(step.source.join('\n')),
  }))
}

const getParsedSteps = ({ steps }) =>
  steps.map((step) => ({
    ...step,
    content: markdownParser.render(step.source.join('  \n')),
  }))

export {
  markdownParser,
  getParsedSteps,
  getArticleTreeFromIpynb,
  getStepsFromMetadata,
  encodeNotebookURL,
  decodeNotebookURL,
}

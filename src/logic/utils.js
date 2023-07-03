import { LayerChoices, LayerNarrative, SectionChoices, SectionDefault } from '../constants'
import ArticleReference from '../models/ArticleReference'
import ArticleTreeWarning, {
  FigureAnchorWarningCode,
  // MarkdownParserWarningCode,
  ReferenceWarningCode,
} from '../models/ArticleTreeWarning'
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
export const getFirstValidMatchFromChoices = (
  candidates = [],
  choiches = [],
  defaultChoice = null,
) => {
  for (let i = 0; i < candidates.length; i++) {
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
export const getSectionFromCellMetadata = (metadata) =>
  getFirstValidMatchFromChoices(
    [].concat(metadata.tags, metadata.jdh?.section),
    SectionChoices,
    SectionDefault,
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
export const getLayerFromCellMetadata = (metadata) =>
  getFirstValidMatchFromChoices(
    [].concat(metadata.tags, metadata.jdh?.layer),
    LayerChoices,
    LayerNarrative,
  )

export const renderMarkdownWithReferences = ({
  idx = -1,
  sources = '',
  referenceIndex = {},
  citationsFromMetadata = {},
  figures = [],
  anchors = [],
  markdownParser,
}) => {
  const references = []
  const warnings = []
  // console.info('markdownParser.render', markdownParser.render(sources))
  const content = markdownParser
    .render(sources)
    // add target blank for all external links
    .replace(/<a href="([^"]+)"/g, (m, href) => {
      if (href.indexOf('http') === 0) {
        return `<a target="_blank" href="${href}"`
      }
      return m
    })
    .replace(/&lt;a[^&]*&gt;(.*)&lt;\/a&gt;/g, '')
    // replace links "figure-*" ending with automatic numbering syntax
    .replace(
      /<a href="#((figure|table|anchor)-[^"]+-\*)">([^<]+)<\/a>/g,
      (m, anchorRef, c, content) => {
        const ref =
          anchorRef.indexOf('anchor-') !== -1
            ? anchors.find((d) => d.ref === anchorRef)
            : figures.find((d) => d.ref === anchorRef)
        if (ref) {
          return `<a data-idx="${ref.idx}" href="#${anchorRef}"  data-ref-type="${ref.type}">figure ${ref.num}</a>`
        }
        return `<a data-idx-notfound href="#${anchorRef}">${content}</a>`
      },
    )
    // replace links "figure-" add data-idx attribute containing a figure id
    .replace(/<a href="#((figure|table|anchor)-[^"]+)">/g, (m, anchorRef) => {
      const ref =
        anchorRef.indexOf('anchor-') !== -1
          ? anchors.find((d) => d.ref === anchorRef)
          : figures.find((d) => d.ref === anchorRef)
      if (ref) {
        return `<a href="#${anchorRef}" data-idx="${ref.idx}" data-ref-type="${ref.type}">`
      }
      warnings.push(
        new ArticleTreeWarning({
          idx,
          code: FigureAnchorWarningCode,
          message: `missing anchor or figure for ref "${anchorRef}" in notebook metadata`,
          context: anchorRef,
        }),
      )
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
  return { content, references, warnings }
}

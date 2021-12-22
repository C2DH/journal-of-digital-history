export default class ArticleTree {
  constructor({
    id='',
    headings = [],
    paragraphs = [],
    sections = {},
    figures = [],
    anchors = [],
    cells = [],
    headingsPositions = [],
    paragraphsPositions = [],
    citationsFromMetadata,
    bibliography
  }) {
    this.id=id
    this.headings= headings
    this.paragraphs = paragraphs
    this.figures = figures
    this.anchors = anchors
    this.cells = cells
    this.sections = sections
    this.headingsPositions = headingsPositions
    this.paragraphsPositions = paragraphsPositions
    this.bibliography = bibliography
    this.citationsFromMetadata = citationsFromMetadata
  }

  formatBibliograhpy({ template='apa', format='html' } = {}) {
    if (this.bibliography) {
      return this.bibliography.format('bibliography', {
        format,
        template,
      })
    }
    return ''
  }
}

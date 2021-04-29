export default class ArticleTree {
  constructor({
    headings = [],
    paragraphs = [],
    sections = {},
    figures = [],
    cells = [],
    headingsPositions = [],
    paragraphsPositions = [],
    citationsFromMetadata,
    bibliography
  }) {
    this.headings= headings
    this.paragraphs = paragraphs
    this.figures = figures
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
  }
}

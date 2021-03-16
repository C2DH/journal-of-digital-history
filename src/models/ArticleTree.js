export default class ArticleTree {
  constructor({
    headings = [],
    paragraphs = [],
    figures = [],
    headingsPositions = [],
    bibliography
  }) {
    this.headings= headings
    this.paragraphs = paragraphs
    this.figures = figures
    this.headingsPositions = headingsPositions
    this.bibliography = bibliography
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

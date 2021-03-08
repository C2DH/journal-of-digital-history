export default class ArticleTree {
  constructor({
    headings = [],
    paragraphs = [],
    figures = [],
    bibliography
  }) {
    this.headings= headings
    this.paragraphs = paragraphs
    this.figures = figures
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

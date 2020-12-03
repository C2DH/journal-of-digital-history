export default class ArticleTree {
  constructor({
    headings = [],
    paragraphs = [],
    bibliography
  }) {
    this.headings= headings
    this.paragraphs = paragraphs
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
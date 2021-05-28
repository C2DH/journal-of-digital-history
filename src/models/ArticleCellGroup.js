export default class ArticleCellGroup {
  constructor({
    type = 'group',
    idx = -1,
    cells = [], // list of ArticleCell instance
  } = {}) {
    this.idx = idx
    this.type = type
    this.cells = cells
    this.headingsIdx = []
    this.cellsIdx = []
    // wil store the local index of the current this.cells array
    this.localHeadingIdx = []
  }

  addArticleCell(cell) {
    if (!this.cells.length) {
      this.idx = cell.idx
    }
    this.cells.push(cell)
    if (cell.isHeading) {
      this.headingsIdx.push(cell.idx)
      this.localHeadingIdx.push(this.cells.length - 1)
    } else {
      this.cellsIdx.push(cell.idx)
    }
  }

  // based on the presence of headings.
  getGroupSections() {
    if (this.sections) {
      return this.sections
    }
    if (this.headingsIdx.length < 1) {
      return [{
        title: '...',
        cells: this.cells
      }]
    }
    const splitPoints = [].concat(
      this.localHeadingIdx[0] !== 0
        ? [0]
        : null,
      this.localHeadingIdx,
      this.localHeadingIdx[this.localHeadingIdx.length -1] !==  this.cells.length - 1
        ? [this.cells.length - 1]
        : null
    ).filter(d => d !== null)
    const sections = []
    for (let i = 0; i < splitPoints.length - 1; i++) {
      sections.push({
        title: this.getCellExcerpt(this.cells[splitPoints[i]]),
        cells: this.cells.slice(splitPoints[i], splitPoints[i + 1])
      })
    }
    console.info('ArticleCellGroup#getGroupSections() splitPoints:', splitPoints,  "vs", this.localHeadingIdx)
    this.sections = sections
    return sections
  }

  getCellExcerpt(cell) {
    if (cell.isHeading) {
      return cell.heading.content
    }
    return cell.source.join('').split(/[\s.?!;:,]/).slice(0, 10)
  }
}

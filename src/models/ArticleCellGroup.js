export default class ArticleCellGroup {
  constructor({
    type = 'group',
    idx = -1,
    headingPositions = [], // list of ArticleCell idx
    cells = [], // list of ArticleCell instance
    cellsPositions = []
  } = {}) {
    this.idx = idx
    this.headingPositions = headingPositions
    this.cells = cells
    this.cellsPositions = cellsPositions
  }

  addArticleCell(cell) {
    if (!this.cells.length) {
      this.idx = cell.idx
    }
    this.cells.push(cell)
    if (cell.isHeading) {
      this.headingsIdx.push(cell.idx)
    } else {
      this.cellsIdx.push(cell.idx)
    }
  }
}

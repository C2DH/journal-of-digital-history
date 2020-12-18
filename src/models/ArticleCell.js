export default class ArticleCell {
  constructor({
    type = 'nd',
    content = '',
    idx = '-1',
    outputs = [],
    source = [],
    metadata = {},
    level = 'ND' // one of 'CODE', 'P', 'H1', 'H2', 'H3'
  }) {
    this.type = type
    this.content = content
    this.idx = idx
    this.outputs = outputs
    this.source = source
    this.metadata = metadata
    this.level = level.toUpperCase()
  }
}

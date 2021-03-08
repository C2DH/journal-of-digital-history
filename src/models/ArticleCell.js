export default class ArticleCell {
  constructor({
    type = 'nd',
    content = '',
    idx = '-1',
    layer = 'narrative',
    section = '',
    // paragraph number, only for level=P
    num = 0,
    outputs = [],
    source = [],
    metadata = {},
    references = [],
    hidden = false,
    level = 'ND', // one of 'CODE', 'P', 'H1', 'H2', 'H3'
    figure = null,
  }) {
    this.type = type
    this.content = String(content)
    this.size = content.length
    this.idx = idx
    this.num = num
    this.outputs = outputs
    this.source = source
    this.metadata = metadata
    this.level = String(level).toUpperCase()
    this.layer = layer
    this.section = section
    this.hidden = hidden
    this.references = references
    this.figure = figure
  }
}

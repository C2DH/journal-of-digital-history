export default class ArticleCell {
  constructor({
    type = 'nd',
    content = '',
    idx = '-1',
    outputs = [],
    source = [],
    metadata = {}
  }) {
    this.type = type
    this.content = content
    this.idx = idx
    this.outputs = outputs
    this.source = source
    this.metadata = metadata
  }
}

export default class ArticleHeading {
  constructor({
    tag = 'h*',
    content = '',
    idx = '-1',
    references = [],
  }) {
    this.tag = tag
    this.content = content
    this.idx = idx;
    this.references = references
  }
}

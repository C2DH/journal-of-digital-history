export default class ArticleHeading {
  constructor({
    tag = 'h*',
    content = '',
    idx = '-1'
  }) {
    this.tag = tag
    this.content = content
    this.idx = idx
  }
}
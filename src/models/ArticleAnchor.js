export default class ArticleAnchor {
  constructor({
    ref = 'anchor-', // 'anchor-something nice' identifier. it must start with constants/AnchorRefPrefix
    idx = -1,
    type = 'anchor'
  }) {
    this.ref = ref
    this.idx = idx
    this.type = type
  }
}

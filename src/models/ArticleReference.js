export default class ArticleReference {
  constructor({
    num = 0,
    id = '',
    ref,
  }) {
    this.num = parseInt(num, 10)
    this.ref = ref
    if (ref) {
      this.shortRef = `${ref.author?.map(d => d.family).join(', ')} ${ref.issued?.year}`
    }
  }
}

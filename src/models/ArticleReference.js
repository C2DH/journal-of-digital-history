export default class ArticleReference {
  constructor({
    num = 0,
    id = '',
    ref,
  }) {
    this.num = parseInt(num, 10)
    this.ref = ref
    if (ref) {
      if (!ref.author && Array.isArray(ref.editor)) {
        this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.editor.map(d => d.family).join(', ').trim()} (Ed.) ${ref.issued?.year}</a>`
      } else {
        this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${ref.issued?.year}</a>`
      }
    }
  }
}

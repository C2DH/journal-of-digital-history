export default class ArticleReference {
  constructor({
    num = 0,
    id = '',
    ref,
  }) {
    this.id = id
    this.num = parseInt(num, 10)
    this.ref = ref
    let year = ""
    let reference = ""
    if (ref) {
      if (ref.issued && ref.issued.year) {
        year = ref.issued.year
      } else if (ref.issued && ref.issued.literal) {
        year = ref.issued.literal
      } else if (ref.accessed && ref.accessed.year) {
        year = ref.accessed.year
      }
      // set shortRef accodring to different condition: use elseif
      if (!ref.author && Array.isArray(ref.editor)) {
        this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.editor.map(d => d.family).join(', ').trim()} (Ed.) ${year}</a>`
      } else if (ref.type ==='webpage') {
        if (ref["container-title"]) {
          reference = ref["container-title"]
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${reference} ${year}</a>`
        } else {
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${year}</a>`
        }
      } else if (ref.type ==='article-magazine' || ref.type ==='article-newspaper') {
         if(!ref.title){
           this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${year}</a>`
         } else {
           this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.title} ${year}</a>`
         }
      } else {
        this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${year}</a>`
      }
    }
  }
}

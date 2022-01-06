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
    const authorNames = this.getAuthorNames(ref)

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
        this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} (Ed.) ${year}</a>`
      } else if (ref.type ==='webpage') {
        if (ref['container-title']) {
          reference = ref['container-title']
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${reference} ${year}</a>`
        } else {
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} ${year}</a>`
        }
      } else if (ref.type ==='article-magazine' || ref.type ==='article-newspaper') {
         if(!ref.title){
           this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} ${year}</a>`
         } else {
           this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.title} ${year}</a>`
         }
      } else {
        this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} ${year}</a>`
      }
    }
  }

  getAuthorNames(ref) {
    // add editors as authors when there are no authors
    let authorNames = !ref.author && Array.isArray(ref.editor)
      ? ref.editor
      : ref.author
    // remap authors to get nice stuff, like Turchin, Currie, Whitehouse, et al. 2018
    authorNames = authorNames.map(d => d.family.trim())
    if(authorNames.length > 3) {
      authorNames = authorNames.slice(0, 3).concat(['et al.'])
    }
    return authorNames.join(', ')
  }
}

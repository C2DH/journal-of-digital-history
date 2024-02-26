export default class ArticleReference {
  constructor({ num = 0, id = '', ref }) {
    this.id = id
    this.num = parseInt(num, 10)
    this.ref = ref
    let year = ''
    let reference = ''

    const authorNames = this.getAuthorNames(ref)
    this.shortRefText = ''

    if (ref) {
      if (ref.issued) {
        if (Array.isArray(ref.issued['date-parts']) && ref.issued['date-parts'].length > 0) {
          year = ref.issued['date-parts'][0][0]
        } else if (ref.issued.year) {
          year = ref.issued.year
        } else if (ref.issued.literal) {
          year = ref.issued.literal
        }
      } else if (ref.accessed?.year) {
        year = ref.accessed.year
      }
      // set shortRef accodring to different condition: use elseif
      if (!ref.author && Array.isArray(ref.editor)) {
        // this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} (Ed.) ${year}</a>`
        this.shortRefText = `${authorNames} (Ed.) ${year}`
      } else if (ref.type === 'webpage') {
        if (ref['container-title']) {
          reference = ref['container-title']
          // this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${reference} ${year}</a>`
          this.shortRefText = `${reference} ${year}`
        } else {
          // this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} ${year}</a>`
          this.shortRefText = `${authorNames} ${year}`
        }
      } else if (ref.type === 'article-magazine' || ref.type === 'article-newspaper') {
        if (!ref.title) {
          // this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} ${year}</a>`
          this.shortRefText = `${authorNames} ${year}`
        } else {
          // this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.title} ${year}</a>`
          this.shortRefText = `${ref.title} ${year}`
        }
      } else {
        // this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${authorNames} ${year}</a>`
        this.shortRefText = `${authorNames} ${year}`
      }

      this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${this.shortRefText}</a>`
    } else {
      this.shortRef = `${id}`
    }
  }

  getAuthorNames(ref) {
    if (!ref) {
      console.warn(`[ArticleReference] Ref not found for id: ${this.id}, num: ${this.num}`)
      return ''
    }
    // add editors as authors when there are no authors
    let authorNames = !ref.author && Array.isArray(ref.editor) ? ref.editor : ref.author
    // remap authors to get nice stuff, like Turchin, Currie, Whitehouse, et al. 2018
    authorNames = (authorNames ?? []).map((d) => d.family.trim())
    if (authorNames.length > 3) {
      authorNames = authorNames.slice(0, 3).concat(['et al.'])
    }
    return authorNames.join(', ')
  }
}

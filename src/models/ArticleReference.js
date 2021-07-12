export default class ArticleReference {
  constructor({
    num = 0,
    id = '',
    ref,
  }) {
    this.num = parseInt(num, 10)
    this.ref = ref
    let year = ""
    let reference = ""
    if (ref) {
      if(ref.issued && ref.issued.year){
      year =ref.issued.year
      }
     if(ref.issued && ref.issued.literal){
      year =ref.issued.literal
      }
     if(ref.accessed && ref.accessed.year){
        year =ref.accessed.year
      }
     if(!ref.author && Array.isArray(ref.editor)){
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.editor.map(d => d.family).join(', ').trim()} (Ed.) ${year}</a>`
        }else{
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${year}</a>`
          if(ref.type ==='webpage'){
            if(ref["container-title"]){
              reference = ref["container-title"]
              this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${reference} ${year}</a>`
            }else{
              this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${year} ${year}</a>`
            }
         }
         if(ref.type ==='article-magazine' || ref.type ==='article-newspaper'){
          if(!ref.title){
            this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.author?.map(d => d.family).join(', ').trim()} ${year}</a>`
          }else{
          this.shortRef = `<a data-href="${ref.id}"><span class="ArticleReference_pointer"></span>${ref.title} ${year}</a>`
        }


      }



     }





    }
  }
}

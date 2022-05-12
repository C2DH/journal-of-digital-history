export default class ArticleFigure {
  constructor({
    ref = 'figure-', // 'figure-12a' figure identifier. Must start with constants/FigureRefPrefix
    type = '', // constants FigureImage, FigureVideo or FigureDatavis,
    module = '', // ModuleTextObject, ModuleObject or ModuleText
    idx = -1,
    num = -1,
    isTable = false,
    isCover = false
  }) {
    this.type = type
    this.module = module
    this.idx = idx
    this.num = num
    this.ref = String(ref)
    this.isTable = isTable
    this.isCover = isCover
    this.label = this.ref.lastIndexOf('-*') === this.ref.length - 2
      ? this.num // automatic numbering using num
      : this.ref.split('-').pop()
  }
}

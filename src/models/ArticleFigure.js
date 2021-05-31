export default class ArticleFigure {
  constructor({
    ref='figure-', // 'figure-12a' figure identifier.
    type = '', // constants FigureImage, FigureVideo or FigureDatavis,
    module = '', // ModuleTextObject, ModuleObject or ModuleText
    idx = -1,
    num = -1,
  }) {
    this.type = type
    this.module = module
    this.idx = idx
    this.num = num
    this.ref=ref
  }
}

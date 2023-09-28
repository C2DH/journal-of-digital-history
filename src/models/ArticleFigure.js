import { FigureRefPrefix } from '../constants'

export default class ArticleFigure {
  constructor({
    ref = null, // 'figure-', // 'figure-12a' figure identifier. Must start with constants/FigureRefPrefix
    type = '', // constants FigureImage, FigureVideo or FigureDatavis,
    module = '', // ModuleTextObject, ModuleObject or ModuleText
    idx = -1,
    num = -1,
    isTable = false,
    isCover = false,
    refPrefix = FigureRefPrefix,
  }) {
    this.type = type
    this.module = module
    this.idx = idx
    this.num = num
    this.ref = ref
    this.isTable = isTable
    this.isCover = isCover
    this.tNLabel = `numbers.${refPrefix.substring(0, refPrefix.length - 1)}`
    // number in the table of contents. It is more important than `num` because it is used to sort the figures
    this.refPrefix = refPrefix
  }

  setNum(num) {
    this.num = num
    if (typeof this.ref !== 'string') {
      this.tNum = this.num
    } else if (this.ref.lastIndexOf('-*') !== -1) {
      this.tNum = this.num
    }
    const refNum = this.ref.split('-').pop()
    if (isNaN(refNum)) {
      return this.num
    }
    return parseInt(refNum)
  }
}

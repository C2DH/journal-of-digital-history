import {
  SectionDefault,
  LayerNarrative,
  RoleDefault
} from '../constants'

export default class ArticleCell {
  constructor({
    type = 'nd',
    content = '',
    idx = -1,
    section = SectionDefault,
    layer = LayerNarrative,
    role = RoleDefault,
    // paragraph number, layer based
    num = 0,
    outputs = [],
    source = [],
    metadata = {},
    references = [],
    hidden = false,
    level = 'ND', // one of 'CODE', 'P', 'H1', 'H2', 'H3'
    figure = null, // ArticleFigure instance, if any
    heading = null, // ArticleHeading instance, if any
  }) {
    this.type = type
    this.content = String(content)
    this.size = content.length
    this.idx = parseInt(idx, 10)
    this.num = num
    this.outputs = outputs
    this.source = source
    this.metadata = metadata
    this.level = String(level).toUpperCase()
    this.section = section
    this.layer = layer
    this.role = layer
    this.hidden = hidden
    this.references = references
    this.figure = figure
    this.isFigure = figure !== null
    this.heading = heading
    this.isHeading = heading !== null
  }
}

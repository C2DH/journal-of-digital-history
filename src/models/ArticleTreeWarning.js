export const MarkdownParserWarningCode = 'markdownParser'
export const ReferenceWarningCode = 'reference'
export const FigureAnchorWarningCode = 'figureAnchor'

export default class ArticleTreeWarning {
  constructor({ idx = '', code = '', message = '', context, error }) {
    this.idx = idx
    this.code = code
    this.message = message

    console.warn(code, message, '\n - idx:', idx, '\n - context :', context, '\n - error :', error)
  }
}

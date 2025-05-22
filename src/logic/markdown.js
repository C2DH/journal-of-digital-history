import MarkdownIt from 'markdown-it'
import MarkdownItAttrs from '@gerhobbelt/markdown-it-attrs'
import MarkdownItMathjax from 'markdown-it-mathjax3'

const markdownParser = MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

markdownParser.use(MarkdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['class', 'id'], // empty array = all attributes are allowed
})
markdownParser.use(MarkdownItMathjax)

export { markdownParser }

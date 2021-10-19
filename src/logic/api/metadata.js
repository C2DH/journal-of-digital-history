import downsize from 'downsize'
import { markdownParser } from '../ipynb'

const render = (md) => ({
  content: typeof md === 'string'
    ? markdownParser.render(md)
        .replace(/&lt;sup&gt;(.*)&lt;\/sup&gt;/g, (m, str) => `<sup>${str}</sup>`)
    : ''
})

export const extractMetadataFromArticle = (article) => {
  const result = {
    title: [],
    plainTitle: '',
    abstract: [],
    plainAbstract: '',
    contributor: [], keywords: [],
    plainContributor: '',
    collaborators: [],
    excerpt: '',
    tags: article?.tags.map(d => d.name)
  }
  if (typeof article?.data === 'undefined') {
    return result
  }
  ['title', 'abstract', 'contributor', 'collaborators'].forEach((key) => {
    if (Array.isArray(article.data[key])) {
      result[key] = article.data[key].map(render)
    }
  })
  result.excerpt = stripHtml(extractExcerpt(result.abstract.map(d => d.content).join(''), 20, '...'))
  result.plainTitle = stripHtml(result.title.map(d => d.content).join(' '))
  result.plainAbstract = stripHtml(result.abstract.map(d => d.content).join(' '))
  result.plainContributor = result.contributor.map(d => {
    return d.content
      .substring(d.content.indexOf('<h3>'), d.content.indexOf('</h3>'))
      .replace(/<h3>([^<]+).*/g, (m, c) => c.trim())
  }).join(', ')
  if (Array.isArray(article.data.keywords)) {
    result.keywords = article.data.keywords.reduce((acc, d) => {
      return acc.concat(String(d).trim().split(/\s*[,;]\s*/))
    }, []).filter(d => d.length)
  }
  return result
}

export const extractExcerpt = (text, words=20, append=" [&hellip;]") => {
  if (typeof text !== 'string' || !text.length) {
    return null
  }
  return downsize(text, { words, append })
}

export const stripHtml = (text) => {
  if (typeof text !== 'string' || !text.length) {
    return ''
  }
  return text.replace(/<br>/ig, '').replace(/<[^>]+>/g, '');
}

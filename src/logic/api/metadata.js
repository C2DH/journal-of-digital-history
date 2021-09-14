import downsize from 'downsize'
import { markdownParser } from '../ipynb'

export const extractMetadataFromArticle = (article) => {
  const result = {
    title: null,
    abstract: null,
    contributors: [], keywords: []
  }

  if (typeof article?.data === 'undefined') {
    return result
  }
  if (Array.isArray(article.data.title)) {
    result.title = markdownParser.render(article.data.title.join(''))
  }
  if (Array.isArray(article.data.abstract)) {
    result.abstract = markdownParser.render(article.data.abstract.join(''))
  }
  if (Array.isArray(article.data.contributor)) {
    result.contributors = article.data.contributor.filter(d => typeof d === 'string').map(d => markdownParser.render(d))
  }
  if (Array.isArray(article.data.keywords)) {
    result.keywords = article.data.keywords.reduce((acc, d) => {
      return acc.concat(String(d).trim().split(/\s*[,;]\s*/))
    }, []).filter(d => d.length)
  }
  return result
}

export const extractExcerpt = (text) => {
  if (typeof text !== 'string' || !text.length) {
    return null
  }
  return downsize(text, {"words": 20, "append": " [&hellip;]"})
}

export const stripHtml = (text) => {
  if (typeof text !== 'string' || !text.length) {
    return ''
  }
  return text.replace(/<[^>]+>/g, '');
}

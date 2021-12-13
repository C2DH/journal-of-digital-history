import { markdownParser} from './ipynb'


export function parseNotebook({ cells=[] }={}) {
  const dataciteRegexp = new RegExp('data-cite=[\'"][^\'"]+[\'"]','g');
  const stats = {
    extentChars: [Infinity, -Infinity],
    extentRefs: [Infinity, -Infinity]
  }
  const parsedCells = []
  cells.forEach((cell, i) => {
    const c = {}
    const tags = cell.metadata.tags ?? []
    const sources = cell.source.join('')
    c.type = cell.cell_type
    c.idx = i
    c.countChars = sources.length
    // does it contains a cite2c marker?
    c.countRefs = [...sources.matchAll(dataciteRegexp)].length

    stats.extentChars = [
      Math.min(stats.extentChars[0], c.countChars),
      Math.max(stats.extentChars[1], c.countChars)
    ]
    stats.extentRefs = [
      Math.min(stats.extentRefs[0], c.countRefs),
      Math.max(stats.extentRefs[1], c.countRefs)
    ]
    c.isHeading = c.type === 'markdown' && !!sources.match(/^\s*#+\s/)
    if (tags.includes('hidden')) {
      // this should be hidden
      return
    }
    c.isHermeneutic = tags.some(t => ['hermeneutics', 'hermeneutics-step'].indexOf(t) !== 0)
    c.isFigure = tags.some(t => t.indexOf('figure-') !== -1)
    c.isTable = tags.some(t => t.indexOf('table-') !== -1)
    c.firstWords = c.type === 'markdown'
      ? markdownParser.render(sources).replace(/<[^>]*>/g, '').split(/[\s\n,.]+/).slice(0, 10).concat(['...']).join(' ')
      : cell.source.slice(0, 1).join(' ')
    c.firstWordsHeading = [
      c.isHermeneutic ? 'Hermeneutics': 'Narrative',
      c.type=="code" ? 'CODE' : null,
      tags.find(t => t.indexOf('table-') !== -1 || t.indexOf('figure-') !== -1)
    ].filter(d => d).join(' / ')

    parsedCells.push(c)
  })
  return { stats, cells:parsedCells }
}

import { useRef } from 'react'
import { groupBy } from 'lodash'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import ArticleCellGroup from '../models/ArticleCellGroup'
import {
  LayerHermeneutics, LayerHermeneuticsStep,
  LayerNarrative, LayerData, LayerFigure
} from '../constants'

export const useIpynbNotebookParagraphs = ({ cells, metadata }) => {
  const treeRef = useRef(null)

  if (!treeRef.current) {
    console.info('useIpynbNotebookParagraphs() parsing article')
    const paragraphs = []
    const articleTree = getArticleTreeFromIpynb({ cells, metadata })
    let bufferCellsGroup = new ArticleCellGroup()

    for (let i = 0; i < articleTree.paragraphs.length; i+=1) {
      if(articleTree.paragraphs[i].layer === LayerHermeneuticsStep) {
        bufferCellsGroup.addArticleCell(articleTree.paragraphs[i])
      } else {
        if (bufferCellsGroup.cells.length) {
          // add this group to paragraphs
          paragraphs.push(bufferCellsGroup)
          bufferCellsGroup = new ArticleCellGroup()
        }
        if([ LayerHermeneutics, LayerNarrative, LayerData, LayerFigure ].includes(articleTree.paragraphs[i].layer)) {
          paragraphs.push(articleTree.paragraphs[i])
        }
      }
    }
    if (bufferCellsGroup.cells.length) {
      paragraphs.push(bufferCellsGroup)
    }
    const sections = groupBy(articleTree.paragraphs, 'section')
    treeRef.current = { articleTree, paragraphs, sections }
  } else {
    console.warn('useIpynbNotebookParagraphs parsing article using ref!')
  }
  return treeRef.current
}

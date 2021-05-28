import { useRef } from 'react'
import { getArticleTreeFromIpynb } from '../logic/ipynb'


export const useIpynbNotebookParagraphs = ({ cells, metadata }) => {
  const treeRef = useRef(null)
  if (!treeRef.current) {
    console.info('useIpynbNotebookParagraphs() parsing article')
    treeRef.current = getArticleTreeFromIpynb({ cells, metadata })
  } else {
    console.warn('useIpynbNotebookParagraphs parsing article using ref!')
  }
  return treeRef.current
}

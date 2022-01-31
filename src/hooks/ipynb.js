import { useRef } from 'react'
import { getArticleTreeFromIpynb } from '../logic/ipynb'


export const useIpynbNotebookParagraphs = ({ id, cells, metadata }) => {
  const treeRef = useRef(null)
  if (!treeRef.current || treeRef.current.id !== id) {
    console.debug('[useIpynbNotebookParagraphs] getArticleTreeFromIpynb id:', id, 'cells:', cells.length)
    treeRef.current = {
      id,
      articleTree: getArticleTreeFromIpynb({ id, cells, metadata })
    }
  } else {
    console.debug('[useIpynbNotebookParagraphs] getArticleTreeFromIpynb not working id:', id)
  }
  return treeRef.current.articleTree
}

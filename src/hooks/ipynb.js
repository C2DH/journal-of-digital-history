import { useMemo } from 'react'
import { getArticleTreeFromIpynb } from '../logic/ipynb'

export const useIpynbNotebookParagraphs = ({ disabled = true, id, cells, metadata }) => {
  console.info('[useIpynbNotebookParagraphs] \n - id:', id, '\n - n. cells:', cells.length)
  const tree = useMemo(() => {
    console.debug('[useIpynbNotebookParagraphs] fresh!')
    return getArticleTreeFromIpynb({ id, cells, metadata })
  }, [id, disabled])
  // const treeRef = useRef(null)
  // if (!treeRef.current || treeRef.current.id !== id) {
  //   console.debug(
  //     '[useIpynbNotebookParagraphs] getArticleTreeFromIpynb id:',
  //     id,
  //     'n. cells:',
  //     cells.length,
  //   )
  //   if (!cells.length) {
  //     return getArticleTreeFromIpynb({ id, cells, metadata })
  //   }
  //   treeRef.current = {
  //     id,
  //     articleTree: getArticleTreeFromIpynb({ id, cells, metadata }),
  //   }
  // } else {
  //   console.debug(
  //     '[useIpynbNotebookParagraphs] use memoized articleTree, id:',
  //     id,
  //     treeRef.current.id,
  //   )
  // }
  return tree
}

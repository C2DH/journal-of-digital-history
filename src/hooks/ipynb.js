import { useMemo } from 'react'
import { getArticleTreeFromIpynb } from '../logic/ipynb'

export const useIpynbNotebookParagraphs = ({ id, cells, metadata }) => {
  console.info('[useIpynbNotebookParagraphs] \n - id:', id, '\n - n. cells:', cells.length)
  const tree = useMemo(() => {
    console.debug(
      '[useIpynbNotebookParagraphs] fresh!',
      '\n - id:',
      id,
      '\n - sample:',
      cells.length ? cells[0].source[0] : null,
    )
    return getArticleTreeFromIpynb({ id, cells, metadata })
  }, [id])
  console.debug('[useIpynbNotebookParagraphs]  \n - id:', id, '\n - articleTree:', tree)
  return tree
}

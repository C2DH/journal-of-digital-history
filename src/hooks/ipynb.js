import { useMemo, useState, useEffect, useRef } from 'react'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { StatusFetching, StatusIdle, StatusSuccess } from '../constants'

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

export const useIpynbNotebook = ({ id, cells, metadata, enabled }) => {
  const [status, setStatus] = useState(StatusIdle)
  const treeId = useRef(null)
  const timer = useRef(null)
  const timerStatus = useRef(null)
  const [tree, setTree] = useState(null)

  useEffect(() => {
    clearTimeout(timer.current)
    clearTimeout(timerStatus.current)
    if (!enabled) {
      return
    }
    if (treeId.current === id) {
      return
    }
    setStatus(StatusFetching)

    timer.current = setTimeout(() => {
      setTree(getArticleTreeFromIpynb({ id, cells, metadata }))
    }, 0)

    timerStatus.current = setTimeout(() => {
      setStatus(StatusSuccess)
    }, 100)
    return () => {
      clearTimeout(timer.current)
      clearTimeout(timerStatus.current)
    }
  }, [id, enabled])

  return { status, tree }
}

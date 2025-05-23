import { useEffect, useMemo, useRef, useState } from 'react'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { StatusFetching, StatusIdle, StatusSuccess } from '../constants/globalConstants'

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
  const propsRef = useRef({ id, cells, metadata })
  const timer = useRef(null)
  const timerStatus = useRef(null)
  const [tree, setTree] = useState(null)

  useEffect(() => {
    clearTimeout(timer.current)
    clearTimeout(timerStatus.current)
    propsRef.current = { id, cells, metadata }
    if (!enabled) {
      setStatus(StatusIdle)
      return
    }
    if (treeId.current === id) {
      return
    }
    setStatus(StatusFetching)

    timer.current = setTimeout(() => {
      setTree(getArticleTreeFromIpynb(propsRef.current))
    }, 2)

    timerStatus.current = setTimeout(() => {
      treeId.current === id
      setStatus(StatusSuccess)
    }, 100)
    return () => {
      clearTimeout(timer.current)
      clearTimeout(timerStatus.current)
    }
  }, [id, enabled])

  return { status, tree }
}

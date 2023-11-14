import React, { useEffect } from 'react'
import { useNotebookBase, useThebeLoader, useThebeConfig, useRenderMimeRegistry } from 'thebe-react'
import { useIpynbNotebookParagraphs } from '../../hooks/ipynb'

function useParagraphs(url, tree) {
  const paragraphs = tree.paragraphs
  const paragraphsGroups = React.useMemo(() => {
    const buffers = []
    let previousLayer = null
    let buffer = new Array()
    paragraphs.forEach((cell, i) => {
      // skip hidden paragraphs
      // if (cell.layer === LayerHidden) {
      //   return
      // }
      if (i > 0 && (cell.layer !== previousLayer || cell.isHeading || cell.figure !== null)) {
        buffers.push([...buffer])
        buffer = []
      }
      buffer.push(i)
      // update previous layer. If there is a figure and you want to isolate it, add figure suffix
      // previousLayer = String(cell.layer) + (cell.figure !== null ? 'figure' : '')
      previousLayer = String(cell.layer)
    })
    if (buffer.length) {
      buffers.push(buffer)
    }
    return buffers
  }, [url])

  return {
    paragraphs,
    paragraphsGroups,
  }
}

export function useNotebook(url, ipynb) {
  const { core } = useThebeLoader()
  const { config } = useThebeConfig()
  const rendermime = useRenderMimeRegistry()
  const articleTree = useIpynbNotebookParagraphs({
    id: url,
    cells: ipynb?.content?.cells ?? ipynb?.cells ?? [],
    metadata: ipynb?.content?.metadata ?? ipynb?.metadata ?? {},
  })

  const { paragraphs, paragraphsGroups } = useParagraphs(url, articleTree)

  // QUESTION: we can create a custom hook here better suited to the article
  const {
    ready,
    attached,
    executing,
    errors,
    notebook,
    setNotebook,
    executeAll,
    executeSome,
    clear,
  } = useNotebookBase()

  useEffect(() => {
    if (!core || !config) return
    const nb = core?.ThebeNotebook.fromIpynb(ipynb, config, rendermime)
    setNotebook(nb)
  }, [core, config])

  return {
    paragraphs,
    paragraphsGroups,
    ready,
    executing,
    attached,
    errors,
    notebook,
    executeAll,
    executeSome,
    clear,
  }
}

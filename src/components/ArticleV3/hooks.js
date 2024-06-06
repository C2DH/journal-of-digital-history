import React, { useMemo } from 'react'
import { useThebeLoader, useThebeConfig, useRenderMimeRegistry } from 'thebe-react'
import { useIpynbNotebookParagraphs } from '../../hooks/ipynb'
import { LayerHidden } from '../../constants';

function useParagraphs(url, tree) {
  const paragraphs = tree.paragraphs.filter(cell => cell.layer !== LayerHidden);
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

  // paragraphs are ArticleCell shaped plain objects?

  const executables = useMemo(() => {
    if (!core || !config || !rendermime) return {}
    return paragraphs
      .filter((p) => p.type === 'code')
      .reduce((acc, p) => {
        acc[p.idx] = {
          id: p.idx,
          thebe: core?.ThebeCodeCell.fromICodeCell(
            {
              cell_type: p.type,
              source: p.source.join(''),
              metadata: {},
            },
            url,
            config,
            rendermime,
          ),
          source: p.source.join(''), // work with source as a string in state
          outputs: p.outputs,
        }
        return acc
      }, {})
  }, [core, config, rendermime, url, paragraphs])

  return {
    paragraphs,
    paragraphsGroups,
    executables,
    bibliography: articleTree.bibliography,
    sections: articleTree.sections
  }
}

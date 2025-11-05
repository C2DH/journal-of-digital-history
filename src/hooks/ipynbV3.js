import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useRenderMimeRegistry, useThebeConfig, useThebeLoader } from 'thebe-react'
import { useIpynbNotebookParagraphs } from './ipynb'
import { useWindowSize } from './windowSize'
import { LayerHidden } from '../constants/globalConstants'
import { getFigureHeight, getFigureOutputs } from '../logic/ipynbV3'

function useParagraphs(url, tree) {
  const paragraphs = React.useMemo(
    () => tree.paragraphs.filter((cell) => cell.layer !== LayerHidden),
    [url, tree],
  )

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
    headingsPositions: articleTree.headingsPositions,
    executables,
    bibliography: articleTree.bibliography,
    sections: articleTree.sections,
  }
}

export const useExtractOutputs = (idx, metadata, outputs) =>
  useMemo(() => getFigureOutputs(outputs, metadata), [idx, outputs])

/**
 * Hook which returns the height of the output from tags
 *  
 * @param {string[]} tags     
 *    The list of tags from which to get the height       
 * @param {boolean} useDefault 
 *    Optional. Boolean value which determines if the default image height must be used.
 *    Default is false.
 * @param {boolean} isCover
 *    Optional. Boolean value which determines if the cover image height must be used.
 *    Default is false.
 * @returns
 *    The height of the output
 */
export const useFigureHeight = (tags, useDefault = false, isCover = false) => {
  const { height } = useWindowSize()

  return getFigureHeight(tags, useDefault ? Math.max(height, 400) * (isCover ? 0.8 : 0.5) : 0)
}

export const useContainerWidth = (containerRef) => {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current) setWidth(containerRef.current.offsetWidth)
  }, [containerRef.current?.offsetWidth])

  return width
}

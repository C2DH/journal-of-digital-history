import React from 'react'
import { LayerNarrative, LayerHermeneutics, LayerData, LayerHidden } from '../../constants'
import ArticleLayers from './ArticleLayers'

const ArticleFlow = ({
  memoid='',
  cells=[],
  height,
  width,
  // onCellChange,
  // onCellClick,
  // onVisibilityChange
  layers=[LayerNarrative, LayerHermeneutics, LayerData],
  children
}) => {
  const cellsGroups = React.useMemo(() => {
    const buffers = []
    let previousLayer = null
    let buffer = new Array()
    cells.forEach((cell,i) => {
      // skip hidden cells
      if (cell.layer === LayerHidden) {
        return
      }
      if (i > 0 && (cell.layer !== previousLayer || cell.isHeading)) {
        buffers.push([...buffer])
        buffer = []
      }
      buffer.push(i)
      // copy value
      previousLayer = String(cell.layer)
    })
    if (buffer.length) {
      buffers.push(buffer)
    }
    return buffers
  }, [memoid])

  const onPlaceholderClickHandler = (e,cell) => {
    console.info('onPlaceholderClickHandler', e,cell)
  }
  console.debug(`[ArticleFlow] component rendered, size: ${width}x${height}px`)
  return (
    <>
    <div style={{
      height, width
    }}></div>
    <div className="position-fixed bg-transparent" style={{
      top: 0,
      zIndex: 3,
      height, width, overflow: "hidden"
    }}>
      <ArticleLayers
        layers={layers}
        onPlaceholderClick={onPlaceholderClickHandler}
        cellsGroups={cellsGroups}
        cells={cells}
        height={height}
        width={width}
      >
        {children}
      </ArticleLayers>
    </div>
    </>
  )
}

export default React.memo(ArticleFlow, (nextProps, prevProps) => {
  if (nextProps.width !== prevProps.width || nextProps.height !== prevProps.height) {
    return false
  }
  return nextProps.memoid === prevProps.memoid
})

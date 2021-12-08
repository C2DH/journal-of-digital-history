import React from 'react'
import { LayerNarrative, LayerHermeneutics, LayerData, LayerHidden } from '../../constants'
import ArticleLayerSwitch from './ArticleLayerSwitch'
import ArticleLayers from './ArticleLayers'
// import {useSpring, animated} from 'react-spring'

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
  // const [styles, api] = useSpring(() => ({ x: 0, y:0, config: { mass: 10, tension: 550, friction: 140 } }))
  // group placeholders on same Layer
  //
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

  const onLayerChangeHandler = (layer) => {
    console.info('onLayerChangeHandler', memoid, layers.indexOf(layer) * width, layer)
    // api.start({x: -layers.indexOf(layer) * width })
  }

  const onPlaceholderClickHandler = (e,cell) => {
    console.info('onPlaceholderClickHandler', e,cell)
    // api.start({x: -layers.indexOf(cell.layer) * width })
  }

  console.debug(`[ArticleFlow] component rendered ${width}x${height}px`)

  return (
    <>
    <div style={{
      height, width
    }}></div>
    <div className="position-fixed bg-transparent" style={{
      top: 0,
      height, width, overflow: "hidden"
    }}>
      <div className="position-absolute" style={{ zIndex: 1 }}>
      <ArticleLayerSwitch
        layers={layers}
        onChange={onLayerChangeHandler}
      />
      </div>
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

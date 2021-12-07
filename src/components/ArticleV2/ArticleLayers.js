import React from 'react'
import ArticleLayer from './ArticleLayer'
import { useQueryParams, StringParam, NumberParam, withDefault, } from 'use-query-params'
import {
  DisplayLayerQueryParam,
  DisplayLayerNarrative,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerCellTopQueryParam
} from '../../constants'



const ArticleLayers = ({
  memoid='',
  layers=[],
  cellsGroups=[],
  cells=[],
  width=0,
  height=0,
  onPlaceholderClick,
  children,
}) => {
  // Store indicies as a local ref, this represents the item order [0,1,2]
  // const order = React.useRef(layers.map((_, index) => index))
  const [{
    [DisplayLayerQueryParam]:selectedLayer,
    [DisplayLayerCellIdxQueryParam]:selectedCellIdx,
    [DisplayLayerCellTopQueryParam]: selectedCellTop
  }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerQueryParam]: withDefault(StringParam, DisplayLayerNarrative),
    [DisplayLayerCellTopQueryParam]: withDefault(NumberParam, 0),
  })

  // const [springs, api] = useSprings(layers.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const onPlaceholderClickHandler = (e, { layer, idx, y }) => {
    console.debug('[ArticleLayers] @onPlaceholderClickHandler:', layer, idx, y)
    setQuery({
      [DisplayLayerQueryParam]: layer,
      [DisplayLayerCellIdxQueryParam]: idx,
      [DisplayLayerCellTopQueryParam]: y
    })
    if (typeof onPlaceholderClick === 'function') {
      onPlaceholderClick(e, { layer, idx, y })
    }
  }
  console.debug('[ArticleLayers] rendered, selected:', selectedLayer)
  return (
    <>
    {layers.map((layer, i) => (
      <ArticleLayer
        memoid={memoid}
        key={layer}
        layer={layer}
        cellsGroups={cellsGroups}
        cells={cells}
        previousLayer={i > 0 ? layers[i-1] : null}
        nextLayer={i < layers.length - 1 ? layers[i+1]: null}
        onPlaceholderClick={onPlaceholderClickHandler}
        selectedCellIdx={selectedCellIdx}
        selectedCellTop={selectedCellTop}
        isSelected={selectedLayer === layer}
        selectedLayer={selectedLayer}
        height={height}
        width={width}
        layers={layers}
        style={{
          width: width,
          height: height -110,
          top: 110,
          overflow: selectedLayer === layer ? "scroll":"hidden",
          zIndex: i,
          // left: i * width
        }}
      >
        {children}
      </ArticleLayer>
    ))}
    </>
  )
}

export default ArticleLayers

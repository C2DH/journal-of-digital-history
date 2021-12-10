import React from 'react'
import ArticleLayer from './ArticleLayer'
import { useQueryParams, StringParam, NumberParam, withDefault, } from 'use-query-params'
import {
  DisplayLayerQueryParam,
  LayerNarrative,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerCellTopQueryParam,
  DisplayPreviousLayerQueryParam
} from '../../constants'


const ArticleLayers = ({
  memoid='',
  layers=[],
  paragraphsGroups=[],
  paragraphs=[],
  width=0,
  height=0,
  onCellPlaceholderClick,
  onCellIntersectionChange,
  children,
}) => {
  // Store indicies as a local ref, this represents the item order [0,1,2]
  // const order = React.useRef(layers.map((_, index) => index))
  const [{
    [DisplayLayerQueryParam]:selectedLayer,
    [DisplayLayerCellIdxQueryParam]:selectedCellIdx,
    [DisplayLayerCellTopQueryParam]: selectedCellTop,
    [DisplayPreviousLayerQueryParam]: previousLayer,
  }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
    [DisplayLayerCellTopQueryParam]: withDefault(NumberParam, 0),
    [DisplayPreviousLayerQueryParam]: StringParam,
  })

  // const [springs, api] = useSprings(layers.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const onCellPlaceholderClickHandler = (e, { layer, idx, y }) => {
    console.debug('[ArticleLayers] @onCellPlaceholderClickHandler:', layer, idx, y)
    // replaceIn not to trgger the changes. This is helpful whenever the user
    // hits the back Button in the browser (or uses the swipe left on mobile)
    setQuery({
      [DisplayLayerQueryParam]: selectedLayer,
      [DisplayLayerCellIdxQueryParam]: idx,
      [DisplayLayerCellTopQueryParam]: y,
      [DisplayPreviousLayerQueryParam]: previousLayer,
    }, 'replaceIn')
    // this query
    setQuery({
      [DisplayLayerQueryParam]: layer,
      [DisplayLayerCellIdxQueryParam]: idx,
      [DisplayLayerCellTopQueryParam]: y,
      [DisplayPreviousLayerQueryParam]: selectedLayer,
    })
    if (typeof onCellPlaceholderClick === 'function') {
      onCellPlaceholderClick(e, { layer, idx, y })
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
        paragraphsGroups={paragraphsGroups}
        paragraphs={paragraphs}
        previousLayerIdx={i > 0 ? layers[i-1] : null}
        nextLayer={i < layers.length - 1 ? layers[i+1]: null}
        onCellPlaceholderClick={onCellPlaceholderClickHandler}
        onCellIntersectionChange={onCellIntersectionChange}
        selectedCellIdx={selectedCellIdx}
        selectedCellTop={selectedCellTop}
        isSelected={selectedLayer === layer}
        selectedLayer={selectedLayer}
        previousLayer={previousLayer}
        height={height}
        width={width}
        layers={layers}
        style={{
          width,
          height,
          top: 0,
          overflow: selectedLayer === layer ? "scroll": "hidden",
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

import React, { useEffect } from 'react'
import ArticleLayer from './ArticleLayer'
import { useQueryParams, StringParam, NumberParam, withDefault } from 'use-query-params'
import {
  DisplayLayerQueryParam,
  LayerNarrative,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerCellTopQueryParam,
  DisplayPreviousLayerQueryParam,
  DisplayPreviousCellIdxQueryParam,
  DisplayLayerHeightQueryParam,
  DisplayLayerSectionParam,
} from '../../constants/globalConstants'
import { useArticleToCStore } from '../../store'

const ArticleLayers = ({
  memoid = '',
  layers = [],
  paragraphsGroups = [],
  paragraphs = [],
  width = 0,
  height = 0,
  onCellPlaceholderClick,
  onCellIntersectionChange,
  onDataHrefClick,
  isJavascriptTrusted = false,
  children,
  // if it is defined, will override the backgroudn color of the first
  // ArticleLayer pushFixed header
  pageBackgroundColor,
  renderedBibliographyComponent,
  renderedFooterComponent,
  renderedLogoComponent,
}) => {
  const clearVisibleCellsIdx = useArticleToCStore((store) => store.clearVisibleCellsIdx)
  // Store indicies as a local ref, this represents the item order [0,1,2]
  // const order = React.useRef(layers.map((_, index) => index))
  const [
    {
      [DisplayLayerQueryParam]: selectedLayer,
      [DisplayLayerCellIdxQueryParam]: selectedCellIdx,
      [DisplayLayerCellTopQueryParam]: selectedCellTop,
      [DisplayPreviousLayerQueryParam]: previousLayer,
      [DisplayPreviousCellIdxQueryParam]: previousCellIdx,
      [DisplayLayerHeightQueryParam]: layerHeight,
      [DisplayLayerSectionParam]: layerSection,
    },
    setQuery,
  ] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
    [DisplayLayerCellTopQueryParam]: withDefault(NumberParam, 100),
    [DisplayPreviousLayerQueryParam]: StringParam,
    [DisplayPreviousCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerHeightQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerSectionParam]: StringParam,
  })

  // const [springs, api] = useSprings(layers.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const onCellPlaceholderClickHandler = (e, { layer, idx, y, height: h }) => {
    console.debug('[ArticleLayers] @onCellPlaceholderClickHandler:', layer, idx, y)
    // replaceIn not to trgger the changes. This is helpful whenever the user
    // hits the back Button in the browser (or uses the swipe left on mobile)
    setQuery(
      {
        [DisplayLayerQueryParam]: selectedLayer,
        [DisplayLayerCellIdxQueryParam]: idx,
        [DisplayLayerCellTopQueryParam]: y,
        [DisplayPreviousLayerQueryParam]: previousLayer,
        [DisplayLayerHeightQueryParam]: layerHeight,
        [DisplayLayerSectionParam]: layerSection,
      },
      'replaceIn',
    )
    // this query
    setQuery({
      [DisplayLayerQueryParam]: layer,
      [DisplayLayerCellIdxQueryParam]: idx,
      [DisplayLayerCellTopQueryParam]: y,
      [DisplayPreviousLayerQueryParam]: selectedLayer,
      [DisplayLayerHeightQueryParam]: h,
      // section is Bibliography, later annexes etc...
      [DisplayLayerSectionParam]: undefined,
    })
    if (typeof onCellPlaceholderClick === 'function') {
      onCellPlaceholderClick(e, { layer, idx, y })
    }
  }

  const onAnchorClickHandler = (e, { layer, idx, previousIdx, previousLayer, y, height: h }) => {
    console.debug(
      '[ArticleLayers] @onAnchorClickHandler:',
      '\n - target:',
      idx,
      layer,
      '\n - source:',
      previousIdx,
      previousLayer,
    )
    // this query
    setQuery({
      [DisplayLayerQueryParam]: layer,
      [DisplayLayerCellIdxQueryParam]: idx,
      [DisplayLayerCellTopQueryParam]: y,
      [DisplayPreviousLayerQueryParam]: previousLayer,
      [DisplayPreviousCellIdxQueryParam]: previousIdx,
      [DisplayLayerHeightQueryParam]: h,
      [DisplayLayerSectionParam]: undefined,
    })
  }

  useEffect(() => {
    console.debug('[ArticleLayers] @useEffect layer changed to:', selectedLayer)
    clearVisibleCellsIdx()
  }, [selectedLayer])
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
          previousLayerIdx={i > 0 ? layers[i - 1] : null}
          nextLayer={i < layers.length - 1 ? layers[i + 1] : null}
          onCellPlaceholderClick={onCellPlaceholderClickHandler}
          onDataHrefClick={onDataHrefClick}
          onAnchorClick={onAnchorClickHandler}
          onCellIntersectionChange={onCellIntersectionChange}
          selectedCellIdx={selectedCellIdx}
          selectedCellTop={selectedCellTop}
          selectedLayerHeight={layerHeight}
          isSelected={selectedLayer === layer}
          selectedLayer={selectedLayer}
          selectedSection={layerSection}
          previousLayer={previousLayer}
          previousCellIdx={previousCellIdx}
          height={height}
          width={width}
          layers={layers}
          isJavascriptTrusted={isJavascriptTrusted}
          style={{
            width,
            height,
            top: 0,
            overflow: selectedLayer === layer ? 'scroll' : 'hidden',
            zIndex: i,
            pointerEvents: selectedLayer === layer ? 'auto' : 'none',
            // left: i * width
          }}
          pageBackgroundColor={i === 0 ? pageBackgroundColor : undefined}
          renderedBibliographyComponent={renderedBibliographyComponent}
          renderedFooterComponent={renderedFooterComponent}
          renderedLogoComponent={renderedLogoComponent}
        >
          {children}
        </ArticleLayer>
      ))}
    </>
  )
}

export default ArticleLayers

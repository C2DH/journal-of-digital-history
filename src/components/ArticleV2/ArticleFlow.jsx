import React from 'react'
import { LayerNarrative, LayerHermeneutics, LayerHidden, IsMobile } from '../../constants'
import ArticleLayers from './ArticleLayers'
import ArticleToC from './ArticleToC'
import styles from './ArticleFlow.module.css'

import { useArticleToCStore } from '../../store'

const ArticleFlow = ({
  memoid = '',
  paragraphs = [],
  height,
  width,
  // onCellChange,
  // onCellClick,
  // onVisibilityChange
  hasBibliography,
  onDataHrefClick,
  binderUrl = null,
  repositoryUrl = null,
  // emailAddress,
  headingsPositions = [],
  tocOffset = 99,
  tocOffsetBottom = 5,
  layers = [LayerNarrative, LayerHermeneutics],
  isJavascriptTrusted = false,
  ignoreBinder = false,
  hideFigures = false,
  renderedBibliographyComponent = null,
  renderedFooterComponent = null,
  // if it is defined, it overrides the style of the ArticleLayout pushFixed
  // header
  pageBackgroundColor,
  // article on mobile must have the logo visible somewhere
  renderedLogoComponent = null,
  plainTitle = null,
  children,
}) => {
  const setVisibleCell = useArticleToCStore((store) => store.setVisibleCell)
  const paragraphsGroups = React.useMemo(() => {
    const buffers = []
    let previousLayer = null
    let buffer = new Array()
    paragraphs.forEach((cell, i) => {
      // skip hidden paragraphs
      if (cell.layer === LayerHidden) {
        return
      }
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
  }, [memoid])

  const onPlaceholderClickHandler = (e, cell) => {
    console.debug('[ArticleFlow] @onPlaceholderClickHandler', e, cell)
  }
  const onCellIntersectionChangeHandler = ({ idx, isIntersecting }) => {
    // console.debug('[ArticleFlow] @onCellIntersectionChangeHandler', idx)
    setVisibleCell(idx, isIntersecting)
  }
  console.debug(
    `[ArticleFlow] component rendered\n - size: ${width}x${height}px`,
    '\n - memoid:',
    memoid,
  )
  return (
    <>
      <div
        className={styles.tocWrapper}
        style={{
          top: tocOffset,
          height: IsMobile ? height : height - tocOffset - tocOffsetBottom - 100,
        }}
      >
        {!IsMobile && (
          <ArticleToC
            binderUrl={binderUrl}
            repositoryUrl={repositoryUrl}
            ignoreBinder={ignoreBinder}
            layers={layers}
            memoid={memoid}
            paragraphs={paragraphs}
            headingsPositions={headingsPositions}
            width={width}
            height={height - 100}
            hasBibliography={hasBibliography}
            hideFigures={hideFigures}
            plainTitle={plainTitle}
          />
        )}
      </div>

      <div
        className="position-fixed bg-transparent"
        style={{
          top: 0,
          zIndex: 3,
          height: height,
          width,
          overflow: 'hidden',
        }}
      >
        <ArticleLayers
          memoid={memoid}
          layers={layers}
          onPlaceholderClick={onPlaceholderClickHandler}
          onDataHrefClick={onDataHrefClick}
          onCellIntersectionChange={onCellIntersectionChangeHandler}
          paragraphsGroups={paragraphsGroups}
          paragraphs={paragraphs}
          height={height}
          width={width}
          pageBackgroundColor={pageBackgroundColor}
          isJavascriptTrusted={isJavascriptTrusted}
          renderedBibliographyComponent={renderedBibliographyComponent}
          renderedFooterComponent={renderedFooterComponent}
          renderedLogoComponent={renderedLogoComponent}
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
  console.debug(
    '[ArticleFlow] rendering requested, memoid:',
    nextProps.memoid,
    nextProps.memoid === prevProps.memoid,
  )
  return nextProps.memoid === prevProps.memoid
})

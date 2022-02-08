import React from 'react'
import { LayerNarrative, LayerHermeneutics, LayerHidden, IsMobile } from '../../constants'
import ArticleLayers from './ArticleLayers'
import ArticleToC from './ArticleToC'
import styles from './ArticleFlow.module.css'

import { useArticleToCStore } from '../../store'

const ArticleFlow = ({
  memoid='',
  paragraphs=[],
  height,
  width,
  // onCellChange,
  // onCellClick,
  // onVisibilityChange
  hasBibliography,
  onDataHrefClick,
  binderUrl=null,
  // emailAddress,
  headingsPositions=[],
  tocOffset=99,
  layers=[LayerNarrative, LayerHermeneutics],
  isJavascriptTrusted = false,
  ignoreBinder=false,
  renderedBibliographyComponent=null,
  renderedFooterComponent=null,
  // if it is defined, it overrides the style of the ArticleLayout pushFixed
  // header
  pageBackgroundColor,
  children
}) => {
  const setVisibleCell = useArticleToCStore(store => store.setVisibleCell)
  const paragraphsGroups = React.useMemo(() => {
    const buffers = []
    let previousLayer = null
    let buffer = new Array()
    paragraphs.forEach((cell,i) => {
      // skip hidden paragraphs
      if (cell.layer === LayerHidden) {
        return
      }
      if (i > 0 && (cell.layer !== previousLayer || cell.isHeading || cell.isFigure || cell.isTable )) {
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
    console.debug('[ArticleFlow] @onPlaceholderClickHandler', e,cell)
  }
  const onCellIntersectionChangeHandler = ({ idx, isIntersecting }) => {
    // console.debug('[ArticleFlow] @onCellIntersectionChangeHandler', idx)
    setVisibleCell(idx, isIntersecting)
  }
  console.debug(`[ArticleFlow] component rendered, size: ${width}x${height}px`)
  return (
    <>
    <div style={{
      height, width
    }}></div>
    <div className={styles.tocWrapper} style={{
      top: IsMobile ? 0 : tocOffset,
      height: IsMobile ? height : height - tocOffset
    }}>
      {!IsMobile && (
        <ArticleToC
          binderUrl={binderUrl}
          ignoreBinder={ignoreBinder}
          layers={layers}
          memoid={memoid}
          paragraphs={paragraphs}
          headingsPositions={headingsPositions}
          width={width}
          height={height}
          hasBibliography={hasBibliography}
        />
      )}
    </div>

    <div className="position-fixed bg-transparent" style={{
      top: 0,
      zIndex: 3,
      height, width, overflow: "hidden"
    }}>

      <ArticleLayers
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
  console.debug('[ArticleFlow] rendering requested, memoid:', nextProps.memoid, nextProps.memoid === prevProps.memoid)
  return nextProps.memoid === prevProps.memoid
})

import React from 'react'
import { LayerNarrative, LayerHermeneutics, LayerHidden } from '../../constants'
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
  // hasBibliography,
  binderUrl=null,
  // emailAddress,
  headingsPositions=[],
  tocOffset=99,
  layers=[LayerNarrative, LayerHermeneutics],
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
    console.debug('[ArticleFlow] @onPlaceholderClickHandler', e,cell)
  }
  const onCellIntersectionChangeHandler = ({ idx, isIntersecting }) => {
    console.debug('[ArticleFlow] @onCellIntersectionChangeHandler', idx)
    setVisibleCell(idx, isIntersecting)
  }
  console.debug(`[ArticleFlow] component rendered, size: ${width}x${height}px`)
  return (
    <>
    <div style={{
      height, width
    }}></div>
    <div className={styles.tocWrapper} style={{
      top: tocOffset,
      height: height - tocOffset
    }}>
      <ArticleToC
        binderUrl={binderUrl}
        layers={layers}
        memoid={memoid}
        paragraphs={paragraphs}
        headingsPositions={headingsPositions}
        width={width}
      />
    </div>

    <div className="position-fixed bg-transparent" style={{
      top: 0,
      zIndex: 3,
      height, width, overflow: "hidden"
    }}>

      <ArticleLayers
        layers={layers}
        onPlaceholderClick={onPlaceholderClickHandler}
        onCellIntersectionChange={onCellIntersectionChangeHandler}
        paragraphsGroups={paragraphsGroups}
        paragraphs={paragraphs}
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

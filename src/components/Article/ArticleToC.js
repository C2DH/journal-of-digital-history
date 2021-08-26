import React from 'react'
import { useArticleStore } from '../../store'
import { LayerHermeneutics } from '../../constants'
import ArticleToCStep from './ArticleToCStep'

const ArticleToC = ({ paragraphs=[], headingsPositions=[], height=0, width=0 }) => {
  const visibleCellsIdx = useArticleStore(state=>state.visibleCellsIdx)

  const firstVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[0] : -1
  const lastVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[visibleCellsIdx.length -1] : -1

  let previousHeadingIdx = -1
  let nextHeadingIdx = -1

  for(let i = 0; i < headingsPositions.length; i++) {
    if (headingsPositions[i] <= firstVisibleCellIdx) {
      previousHeadingIdx = headingsPositions[i]

    }
    if (nextHeadingIdx === -1 && headingsPositions[i] >= lastVisibleCellIdx) {
      nextHeadingIdx = headingsPositions[i]
      // nextVisibleLoopIndex = i
    }
  }
  if (!width) {
    return null
  }
  const cellsIndex = []
  paragraphs.forEach((p) => {
    cellsIndex[p.idx] = p
  })
  return (
    <aside className="ArticleToC position-absolute py-4" style={{
      height,
      width,
      overflow: 'scroll', pointerEvents: 'auto'}}>
      <ArticleToCStep
        width={width}
        active={lastVisibleCellIdx < 1}
        idx='top'
      >
        (top)
      </ArticleToCStep>
      {headingsPositions.map((d, i) => {
        const cell = cellsIndex[d]
        if (!cell) {
          return null
        }
        // is last only if next heading is higher than this one, or it is a hermeneutic
        const isHermeneutics = cell.layer === LayerHermeneutics
        // const isLast
        return (
          <ArticleToCStep
            width={width}
            key={i}
            idx={cell.idx}
            level={cell.level}
            isFigure={cell.isFigure}
            isTable={cell.isTable}
            isHermeneutics={isHermeneutics}
            active={cell.idx >= previousHeadingIdx && cell.idx <= lastVisibleCellIdx}
            className={isHermeneutics ? 'hermeneutics': ''}
          >
            {cell.isHeading
              ? cell.heading.content
              : cell.isFigure
                ? cell.figure.ref
                : '(na)'
            }
          </ArticleToCStep>
        )
      })}
      <ArticleToCStep
        width={width}
        className="mt-3"
        idx='bibliography'
      >
        (bibliography)
      </ArticleToCStep>
    </aside>
  )
}

export default ArticleToC

import React, { useEffect } from 'react'
import { useSpring, a, config } from 'react-spring'
// import { RoleHidden } from '../../constants'
import { useArticleStore } from '../../store'
import { LayerHermeneutics } from '../../constants'
import ArticleToCStep from './ArticleToCStep'

const ArticleToC = ({ paragraphs=[], headingsPositions=[] }) => {
  const visibleCellsIdx = useArticleStore(state=>state.visibleCellsIdx)
  const [{ y }, api] = useSpring(() => ({ y:0, config: config.stiff }))

  const firstVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[0] : -1
  const lastVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[visibleCellsIdx.length -1] : -1

  let previousHeadingIdx = -1
  let nextVisibleLoopIndex = -1
  let nextHeadingIdx = -1

  // get the previous heading position
  // console.info('firstVisibleCellIdx: ', firstVisibleCellIdx)
  // for each headingPoisition, get the cell index.
  // if the cell index is less than  index
  for(let i = 0; i < headingsPositions.length; i++) {
    if (headingsPositions[i] <= firstVisibleCellIdx) {
      previousHeadingIdx = headingsPositions[i]

    }
    if (nextHeadingIdx === -1 && headingsPositions[i] >= lastVisibleCellIdx) {
      nextHeadingIdx = headingsPositions[i]
      nextVisibleLoopIndex = i
    }
  }

  useEffect(() => {
    api.start({ y: -nextVisibleLoopIndex * 20 })
  })

  const cellsIndex = []
  paragraphs.forEach((p) => {
    cellsIndex[p.idx] = p
  })
  // console.info('previousHeadingIdx ', previousHeadingIdx, headingsPositions, firstVisibleCellIdx )
  return (
    <a.aside className="ArticleToC" style={{ y }}>
      <ArticleToCStep className="mb-3"
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
        className="mt-3"
        idx='bibliography'
      >
        (bibliography)
      </ArticleToCStep>
    </a.aside>
  )
}

export default ArticleToC

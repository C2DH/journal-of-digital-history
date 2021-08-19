import React from 'react'
// import { RoleHidden } from '../../constants'
import { useArticleStore } from '../../store'
import { LayerHermeneutics } from '../../constants'
import ArticleToCStep from './ArticleToCStep'

const ArticleToC = ({ steps=[], headingsPositions=[] }) => {
  const visibleCellsIdx = useArticleStore(state=>state.visibleCellsIdx)
  const firstVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[0] : -1
  const step = visibleCellsIdx.length ? visibleCellsIdx[visibleCellsIdx.length -1] : -1

  let previousHeadingIdx = -1
  let nextHeadingIdx = -1

  // for each headingPoisition, get the cell index.
  // if the cell index is less than  index
  for(let i = 0; i < headingsPositions.length; i++) {
    if (headingsPositions[i] <= firstVisibleCellIdx) {
      previousHeadingIdx = headingsPositions[i]
    }
    if (nextHeadingIdx === -1 && headingsPositions[i] >= step) {
      nextHeadingIdx = headingsPositions[i]
    }
  }
  // console.info('previousHeadingIdx ', previousHeadingIdx, headingsPositions, firstVisibleCellIdx )
  return (
    <aside className="ArticleToC">
      <ArticleToCStep className="mb-3"
        active={step < 1}
        idx='top'
      >
        (top)
      </ArticleToCStep>
      {steps.filter(d => (d.isHeading && d.heading.level) || d.isFigure || d.isTable).map((d, i) => {
        // is last only if next heading is higher than this one, or it is a hermeneutic
        const isHermeneutics = d.layer === LayerHermeneutics
        // const isLast
        return (
          <ArticleToCStep
            key={i}
            idx={d.idx}
            level={d.level}
            isFigure={d.isFigure}
            isTable={d.isTable}
            isHermeneutics={isHermeneutics}
            active={d.idx >= previousHeadingIdx && d.idx <= step}
            className={isHermeneutics ? 'hermeneutics': ''}
          >
            {d.isHeading
              ? d.heading.content
              : d.isFigure
                ? d.figure.ref
                : '(na)'
            }
          </ArticleToCStep>
        )
      })}
      <ArticleToCStep
        className="mt-3"
        idx='bibliography'
        active={step >= steps.length -1}
      >
        (bibliography)
      </ArticleToCStep>
    </aside>
  )
}

export default ArticleToC

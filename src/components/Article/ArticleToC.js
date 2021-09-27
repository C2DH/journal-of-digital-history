import React from 'react'
import { useTranslation } from 'react-i18next'
import { useArticleStore } from '../../store'
import { LayerHermeneutics } from '../../constants'
import ArticleToCStep from './ArticleToCStep'

const ArticleToC = ({ paragraphs=[], headingsPositions=[], height=0, width=0, hasBibliograhy }) => {
  const { t } = useTranslation()
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
  let count = 0

  return (
    <aside className="ArticleToC position-absolute pb-4" style={{
      height,
      width,
      overflow: 'scroll', pointerEvents: 'auto'}}>
      {headingsPositions.map((d, i) => {
        const cell = cellsIndex[d]
        if (!cell || cell.hidden) {
          return null
        }
        const nextCell = i < headingsPositions.length - 1
          ? cellsIndex[headingsPositions[i + 1]]
          : null
        let isSectionStart = false
        let isSectionEnd = false
        if(cell.isHeading && cell.heading.level === 2) {
          isSectionStart = true
        }
        if (count === 0) {
          isSectionEnd = true
          isSectionStart = true
        }
        if (nextCell && nextCell.isHeading && nextCell.heading.level === 2 ) {
          isSectionEnd = true
        }
        if(!nextCell) {
          isSectionEnd = true
        }

        count++
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
            isSectionStart={isSectionStart}
            isSectionEnd={isSectionEnd}
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
      {hasBibliograhy?
      (
        <ArticleToCStep
          width={width}
          className="mt-3"
          idx='bibliography'
          level="H2"
          isSectionStart
          isSectionEnd
        >
        {t('bibliography')}
        </ArticleToCStep>
      ):null}
    </aside>
  )
}

export default ArticleToC
